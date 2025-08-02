import { DataElement } from '@state/form-controls';
import * as d3 from 'd3';
import { useRef } from 'react';
import styles from './VirusPlot.module.css';
import { infectionStates, ModelReferences, mouseMetrics, mouseX, selectedMetric, type MouseMetricKeys } from '@state/chart';
import { Chart, LoadedChart, SimulationRunStatuses } from '@state/simulation-runs';
import { LoadingSpinner } from './LoadingSpinner';
import { useSignals } from '@preact/signals-react/runtime';
import { Paper, Title } from '@mantine/core';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';

type VirusPlotProps = {
  chart: Chart;
};

const lineStyles = {
  [ModelReferences.model_reference.value]: {
    style: 'solid',
    dashArray: '1, 1',
    color: '#1f77b4'
  },
  [ModelReferences.model_network_poisson.value]: {
    style: 'stroke-dasharray',
    dashArray: '2, 2',
    color: '#ff7f0e'
  },
  [ModelReferences.model_network_negative_binomial.value]: {
    style: 'stroke-dasharray',
    dashArray: '5 10 15 5 10 15',
    color: '#2ca02c'
  },
};

const VirusPlotSvg = ({ chart }: { chart: LoadedChart}) => {
  useSignals();
  const matchesMediumAndUp = useMediaQuery('(min-width: 800px)');
  const colorScheme = useColorScheme();
  const area = {
    plot: {
      width: matchesMediumAndUp ? ((document.documentElement.clientWidth * 0.7) - (2 * 50)) : (document.documentElement.clientWidth / 2.5),
      height: matchesMediumAndUp ? ((document.documentElement.clientHeight * 0.33) - 125) : (document.documentElement.clientHeight / 3),
      margin: {
        top: matchesMediumAndUp ? 20 : 20,
        right: matchesMediumAndUp ? 50 : 10,
        bottom: 50,
        left: matchesMediumAndUp ? 60 : 100,
      },
    },
    legend: { height: 0 },
  };

  const svgRef = useRef<SVGSVGElement | null>(null);  

  const data = chart.data ?? [];
  if (!data || data.length === 0) return;

  const plotWidth = area.plot.width - area.plot.margin.left - area.plot.margin.right;
  const plotHeight = area.plot.height - area.plot.margin.top - area.plot.margin.bottom;

  /* gather plot information */
  const time = data.map((d) => d.time);
  const currentMetric = selectedMetric.value;
  const x = d3.scaleLinear()
    .domain(d3.extent(time) as [number, number])
    .range([0, plotWidth]);
  const yData = data.map(({state}) => state[currentMetric]);
  const y = d3.scaleLinear()
    .domain([
      Math.min(0, d3.min(yData) || 0),
      d3.max(yData) || 1
    ])
    .nice()
    .range([plotHeight, 0]);

  /* draw the plot area and axes */
  d3.select(svgRef.current).selectAll('*').remove();
  const svg = d3.select(svgRef.current)
    .attr('width', area.plot.width)
    .attr('height', area.plot.height);
  const plotGroup = svg.append('g')
    .attr('transform', `translate(${area.plot.margin.left},${area.plot.margin.top})`);
  plotGroup.append('g')
    .attr('transform', `translate(0, ${plotHeight})`)
    .call(d3.axisBottom(x));
  plotGroup.append('g')
    .call(d3.axisLeft(y));

  /* Draw lines for each model_type (multiple lines for "all" model_type) */
  type GroupedType = Record<MouseMetricKeys, DataElement[]>;
  const grouped: GroupedType = data.reduce((acc, d) => {
    const modelType = d.model_type || chart.modelType;
    if (modelType === 'all') return acc; // skip 'all'
    if (!acc[modelType]) acc[modelType] = [];
    acc[modelType].push(d);
    return acc;
  }, {} as GroupedType);

  Object.entries(grouped).forEach(([modelType, group]) => {
    const styleConfig = lineStyles[modelType as keyof typeof lineStyles];
    const line = d3.line<DataElement>()
      .x((d) => x(d.time))
      .y(({ state }) => Math.max(y(state[currentMetric]), 0));
    const path = plotGroup.append('path')
      .datum(group)
      .attr('fill', 'none')
      .attr('stroke', styleConfig.color)
      .attr('stroke-width', 2)
      .attr('d', line);
    if (styleConfig.style === 'stroke-dasharray') {
      path.attr('stroke-dasharray', styleConfig.dashArray);
    } else {
      path.attr('stroke-dasharray', null);
    }
  });

  /* Draw vertical bar if mouseX is set - i.e. if the mouse is within the plot area */
  if (mouseX.value !== null) {
    // Get the closest x value (time) for each line
    const mouseTime = x.invert(mouseX.value);
    // Build a MouseMetric object with all required keys
    const metrics: typeof mouseMetrics.value = {
      model_reference: { metric: currentMetric, x: NaN, y: NaN },
      model_network_poisson: { metric: currentMetric, x: NaN, y: NaN },
      model_network_negative_binomial: { metric: currentMetric, x: NaN, y: NaN },
    };
    Object.entries(grouped).forEach(([modelType, group]) => {
      // Find closest data point in this group
      const closest = group.reduce((prev, curr) =>
        Math.abs(curr.time - mouseTime) < Math.abs(prev.time - mouseTime) ? curr : prev
      );
      const closestX = x(closest.time);
      const closestY = y(closest.state[currentMetric]);
      metrics[modelType as MouseMetricKeys] = {
        x: closestX,
        y: closestY,
        metric: currentMetric
      };
    });
    mouseMetrics.value = metrics;

    plotGroup.append('line')
      .attr('x1', mouseX.value)
      .attr('x2', mouseX.value)
      .attr('y1', 0)
      .attr('y2', plotHeight)
      .attr('stroke', colorScheme === 'dark' ? '#fff' : '#000')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '1, 1')
      .attr('pointer-events', 'none');

    // Draw a small circle for each line at the closest point
    Object.entries(grouped).forEach(([modelType, group]) => {
      // Interpolate y value at mouseTime using d3 line interpolation
      const styleConfig = lineStyles[modelType as keyof typeof lineStyles];
      const mouseTime = x.invert(mouseX.value ?? 0);
      // Find the two data points surrounding mouseTime
      let left = group[0], right = group[group.length - 1];
      for (let i = 1; i < group.length; i++) {
        if (group[i].time >= mouseTime) {
          left = group[i - 1];
          right = group[i];
          break;
        }
      }
      let interpY = NaN;
      if (left && right && left !== right) {
        const t = (mouseTime - left.time) / (right.time - left.time);
        interpY = y(left.state[currentMetric]) * (1 - t) + y(right.state[currentMetric]) * t;
      } else if (left) {
        interpY = y(left.state[currentMetric]);
      }
      if (!isNaN(interpY)) {
        plotGroup.append('circle')
          .attr('cx', mouseX.value)
          .attr('cy', interpY)
          .attr('r', 6)
          .attr('fill', styleConfig.color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('pointer-events', 'none');
      }
    });
  }

  /* mouse event handlers */
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (svgRef.current as SVGSVGElement).getBoundingClientRect();
    const xPos = e.clientX - rect.left - area.plot.margin.left;
    if (xPos >= 0 && xPos <= plotWidth) {
      mouseX.value = xPos;
    } else {
      mouseX.value = null;
    }
  };
  const handleMouseLeave = () => {
    mouseX.value = null;
  };

  return (
    <svg
      ref={svgRef}
      width={area.plot.width}
      height={area.plot.height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'crosshair' }}
    />
  );
};


const VirusPlot = ({ chart }: VirusPlotProps) => {
  useSignals();

  if (chart.status === SimulationRunStatuses.LOADING_R) {
    return (
      <Paper shadow="xs" p="xl" className={styles.virusPlotRoot}>

        <Title order={2}>{ModelReferences[chart.modelType].label}</Title>
        {/* <h2 className={styles.virusPlotTitle}></h2> */}
        <LoadingSpinner text='Loading project...' />
      </Paper>
    );
  }

  if (chart.status === SimulationRunStatuses.ERROR) {
    return (
      <Paper shadow="xs" p="xl" className={styles.virusPlotRoot}>
        <Title order={2}>{ModelReferences[chart.modelType].label}</Title>
        <div>An error occurred</div>
      </Paper>
    )
  }

  if (chart?.status === SimulationRunStatuses.IN_PROGRESS && (chart as LoadedChart)?.data?.length === 0) {
    return (
      <Paper shadow="xs" p="xl" className={styles.virusPlotRoot}>
        <Title order={2}>{ModelReferences[chart.modelType].label}</Title>
        <LoadingSpinner text='Crunching numbers...' />
      </Paper>
    );
  }

  return (
    <Paper shadow="xs" p="sm" className={styles.virusPlotRoot}>
      <Title order={2}>{ModelReferences[chart.modelType].label}</Title>
      <VirusPlotSvg chart={(chart as LoadedChart)} />
    </Paper>
  )
};

export { VirusPlot };
