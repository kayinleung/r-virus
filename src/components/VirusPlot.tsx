import { DataElement } from '@state/form-controls';
import * as d3 from 'd3';
// import { useRef } from 'react';
import { Paper, Title } from '@mantine/core';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { useSignals } from '@preact/signals-react/runtime';
import { lineStyles, ModelReferences, mouseMetrics, mouseX, selectedMetric, type MouseMetricKeys } from '@state/chart';
import { Chart, LoadedChart, SimulationRunStatuses } from '@state/simulation-runs';
import { useRef } from 'preact/hooks';
import { LoadingSpinner } from './LoadingSpinner';
import styles from './VirusPlot.module.css';

type VirusPlotProps = {
  chart: Chart;
};

const VirusPlotSvg = ({ chart }: { chart: LoadedChart}) => {
  useSignals();

  const handleMouseLeave = () => {
    mouseX.value = null;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if(!svgRect) return;
    
    // Get mouse x position within plot area
    const mouseXPos = e.clientX - svgRect.left - area.plot.margin.left;
    mouseX.value = mouseXPos;

    // Find the closest time value from the data to the mouse position
    const mouseTime = x.invert(mouseXPos);
    let closestTime = data[0]?.time;
    let minDist = Math.abs(mouseTime - closestTime);

    for (let i = 1; i < data.length; i++) {
      const dist = Math.abs(mouseTime - data[i].time);
      if (dist < minDist) {
        closestTime = data[i].time;
        minDist = dist;
      }
    }

    // Set mouseMetrics.value.t to the closest time
    mouseMetrics.value.t = closestTime;
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if(!svgRect) return;

    mouseX.value = e.touches[0].clientX - svgRect.left - area.plot.margin.left;
  };

  const matchesMediumAndUp = useMediaQuery('(min-width: 800px)');
  const colorScheme = useColorScheme();
  const area = {
    plot: {
      width: matchesMediumAndUp ? ((document.documentElement.clientWidth * (0.7 / 2)) - (2 * 20)) : ((document.documentElement.clientWidth * 0.7)),
      height: matchesMediumAndUp ? ((document.documentElement.clientHeight * 0.5) - 125) : ((document.documentElement.clientHeight * 0.33) - 125),
      margin: {
        top: matchesMediumAndUp ? 20 : 20,
        right: matchesMediumAndUp ? 20 : 10,
        bottom: 20,
        left: matchesMediumAndUp ? 60 : 20,
      },
    },
    legend: { height: 0 },
  } as const;

  const svgRef = useRef<SVGSVGElement | null>(null);  

  const plotWidth = area.plot.width - area.plot.margin.left - area.plot.margin.right;
  const plotHeight = area.plot.height - area.plot.margin.top - area.plot.margin.bottom;

  const data = chart.data ?? [];
  if (!data || data.length === 0) return;

  /* gather plot information */
  const time = data.map((d) => d.time).filter((t): t is number => t !== undefined);
  const currentMetric = selectedMetric.value;
  const x = d3.scaleLinear()
    .domain(d3.extent(time) as [number, number])
    .range([0, plotWidth]);
  const yData = data.map(({state}) => state?.[currentMetric]).filter((v): v is number => v !== undefined);
  const y = d3.scaleLinear()
    .domain([
      Math.min(0, d3.min(yData) || 0),
      d3.max(yData) || 1
    ])
    .nice()
    .range([plotHeight, 0]);

  if(time.length === 0 || yData.length === 0) {
    return <div>No data available for the selected metric.</div>;
  }

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
      .y(({ state }) => Math.max(y(state?.[currentMetric]), 0));
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
    // Get the interpolated y value at mouseTime for each line
    const mouseTime = x.invert(mouseX.value);
    Object.entries(grouped).forEach(([modelType, group]) => {
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
        interpY = left.state?.[currentMetric] * (1 - t) + right.state?.[currentMetric] * t;
      } else if (left) {
        interpY = left.state?.[currentMetric];
      }
      if (!isNaN(interpY)) {
        mouseMetrics.value[modelType as MouseMetricKeys] = interpY;
      }
    });

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
        interpY = y(left.state?.[currentMetric]) * (1 - t) + y(right.state?.[currentMetric]) * t;
      } else if (left) {
        interpY = y(left.state?.[currentMetric]);
      }
      if (!isNaN(interpY)) {
        plotGroup.append('circle')
          .attr('cx', mouseX.value)
          .attr('cy', interpY)
          .attr('r', 6)
          .attr('fill', styleConfig.color)
          .attr('stroke', colorScheme === 'dark' ? '#fff' : '#000')
          .attr('stroke-width', 2)
          .attr('pointer-events', 'none');
      }
    });
  }

  return (
    <svg
      ref={svgRef}
      width={area.plot.width}
      height={area.plot.height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
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
