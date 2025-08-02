import { DataElement } from '@state/form-controls';
import * as d3 from 'd3';
import { useRef } from 'react';
import styles from './VirusPlot.module.css';
import { infectionStates, ModelReferences, selectedMetric } from '@state/chart';
import { Chart, LoadedChart, SimulationRunStatuses } from '@state/simulation-runs';
import { LoadingSpinner } from './LoadingSpinner';
import { useSignals } from '@preact/signals-react/runtime';
import { Paper, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type VirusPlotProps = {
  chart: Chart;
};

const VirusPlotSvg = ({ chart }: { chart: LoadedChart}) => {

  useSignals();

  const matchesMediumAndUp = useMediaQuery('(min-width: 800px)');
  console.log('VirusPlot - matchesMediumAndUp=', matchesMediumAndUp);
  const area = {
    plot: {
      width: matchesMediumAndUp ? ((document.documentElement.clientWidth * 0.7) - (2 * 20)) : (document.documentElement.clientWidth / 2.5), // Width of the plot area including margins
      height: matchesMediumAndUp ? ((document.documentElement.clientHeight * 0.33) - 125) : (document.documentElement.clientHeight / 3),  // Height of the plot area including the legend and margins
      margin: {
        top: matchesMediumAndUp ? 20 : 20,
        right: matchesMediumAndUp ? 50 : 10,
        bottom: 50,
        left: matchesMediumAndUp ? 80 : 100,
      },
    },
    legend: {
      height: 0,
    },
  };

  const svgRef = useRef<SVGSVGElement | null>(null);

  const data = chart.data;
  const currentSvg = svgRef.current;
  if (!data || data.length === 0) return;

  const plotWidth = area.plot.width - area.plot.margin.left - area.plot.margin.right;
  const plotHeight = area.plot.height - area.plot.margin.top - area.plot.margin.bottom;

  // Clear previous SVG content
  d3.select(currentSvg).selectAll('*').remove();

  const svg = d3.select(currentSvg)
    .attr('width', area.plot.width)
    .attr('height', area.plot.height);

  // Add a group for the plot area with correct margins
  const plotGroup = svg.append('g')
    .attr('transform', `translate(${area.plot.margin.left},${area.plot.margin.top})`);

  const time = data.map((d) => d.time);

  // Get the currently selected metric
  const currentMetric = selectedMetric.value;
  const metricState = infectionStates[currentMetric];
  
  const x = d3.scaleLinear()
    .domain(d3.extent(time) as [number, number])
    .range([0, plotWidth]);

  // Only extract data for the selected metric
  const yData = data.map(({state}) => state[currentMetric]);
  
  const y = d3.scaleLinear()
    .domain([
      Math.min(0, d3.min(yData) || 0), // Ensure 0 is included in domain
      d3.max(yData) || 1
    ])
    .nice()
    .range([plotHeight, 0]);

  // X-axis
  plotGroup.append('g')
    .attr('transform', `translate(0, ${plotHeight})`)
    .call(d3.axisBottom(x));

  // Y-axis
  plotGroup.append('g')
    .call(d3.axisLeft(y));

  const line = d3.line<DataElement>()
    .x((d) => x(d.time))
    .y(({ state }) => Math.max(y(state[currentMetric]), 0));

  plotGroup.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', metricState.color)
    .attr('stroke-width', 2) // Increased stroke width for better visibility
    .attr('d', line);


  return (
    <svg ref={svgRef}></svg>
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

  if (chart?.status === SimulationRunStatuses.IN_PROGRESS && (chart as LoadedChart)?.data.length === 0) {
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
