import { DataElement } from '@state/form-controls';
import * as d3 from 'd3';
import { useRef } from 'react';
import styles from './VirusPlot.module.css';
import { useEffect } from 'preact/hooks';
import { useMediaQuery, useTheme } from '@mui/material';
import { infectionStates, ModelReferences, selectedMetric } from '@state/chart';
import { Chart, LoadedChart, SimulationRunStatuses } from '@state/simulation-runs';
import { LoadingSpinner } from './LoadingSpinner';
import { useSignals } from '@preact/signals-react/runtime';

type VirusPlotProps = {
  chart: Chart;
};


// TODO: Only show the selected metric
const VirusPlotSvg = ({ chart }: { chart: LoadedChart}) => {
  // Use useSignals to react to selectedMetric changes
  useSignals();
  
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const area = {
    plot: {
      width: matches ? (document.documentElement.clientWidth / 1.2) : (document.documentElement.clientWidth / 2.5), // Width of the plot area including margins
      height: matches ? (document.documentElement.clientHeight / 4.5) : (document.documentElement.clientHeight / 3),  // Height of the plot area including the legend and margins
      margin: {
        top: matches ? 5 : 20,
        right: matches ? 5 : 10,
        bottom: 50,
        left: matches ? 80 : 100,
      },
    },
    legend: {
      height: 0,
    },
  };

  const svgRef = useRef<SVGSVGElement | null>(null);

  const data = chart.data;
  useEffect(() => {
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

    return () => {
      d3.select(currentSvg).selectAll('*').remove();
    };
  }, [
    data, 
    area.plot.height,
    area.plot.width,
    area.plot.margin.top,
    area.plot.margin.right,
    area.plot.margin.bottom,
    area.plot.margin.left,
  ]);

  return (
    <svg ref={svgRef}></svg>
  );
};


const VirusPlot = ({ chart }: VirusPlotProps) => {
  useSignals();

  if (chart.status === SimulationRunStatuses.LOADING_R) {
    return (
      <div className={styles.virusPlotRoot}>
        <h2>{ModelReferences[chart.modelType].label}</h2>
        <LoadingSpinner text='Loading project...' />
      </div>
    );
  }

  if (chart.status === SimulationRunStatuses.ERROR) {
    return (
    <div className={styles.virusPlotRoot}>
      <h2>{ModelReferences[chart.modelType].label}</h2>
      <div>An error occurred</div>
    </div>
    )
  }

  if (chart?.status === SimulationRunStatuses.IN_PROGRESS && (chart as LoadedChart)?.data.length === 0) {
    return (
      <div className={styles.virusPlotRoot}>
        <h2>{ModelReferences[chart.modelType].label}</h2>
        <LoadingSpinner text='Crunching numbers...' />
      </div>
    );
  }

  return (
    <div className={styles.virusPlotRoot}>
      <h2>{ModelReferences[chart.modelType].label}</h2>
      <VirusPlotSvg chart={(chart as LoadedChart)} />
    </div>
  )
};

export { VirusPlot };
