import { DataElement } from '@state/form-controls';
import * as d3 from 'd3';
import { useRef } from 'react';
import styles from './VirusPlot.module.css';
import { useEffect } from 'preact/hooks';
import { useMediaQuery, useTheme } from '@mui/material';
import { infectionStates, ModelReferences } from '@state/chart';
import type { StateKey } from '@state/chart';
import { Chart, LoadedChart, SimulationRunStatuses } from '@state/simulation-runs';
import { LoadingSpinner } from './LoadingSpinner';
import { useSignals } from '@preact/signals-react/runtime';

type VirusPlotProps = {
  chart: Chart;
};

const VirusPlotSvg = ({ chart }: { chart: LoadedChart}) => {
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

    const color = d3.scaleOrdinal<string>()
      .domain(Object.keys(infectionStates))
      .range(Object.values(infectionStates).map((state) => state.color));

    const x = d3.scaleLinear()
      .domain(d3.extent(time) as [number, number])
      .range([0, plotWidth]);

    const yData = data.map(({state}) => ({
      S: state.S,
      E: state.E,
      I: state.I,
      R: state.R,
      incidence : state.incidence
    }))
    const y = d3.scaleLinear()
      .domain([
        d3.min(yData, (d) => Math.min(...Object.values(d).flat())) || 0,
        d3.max(yData, (d) => Math.max(...Object.values(d).flat())) || 0
      ])
      .nice()
      .range([plotHeight, 0]);

    plotGroup.append('g')
      .attr('transform', `translate(0, ${plotHeight})`)
      .call(d3.axisBottom(x));

    plotGroup.append('g')
      .call(d3.axisLeft(y));

    Object.entries(infectionStates)
      .filter(([key]) => key !== 'time')
      .forEach(([key, state]) => {
        const line = d3.line<DataElement>()
          .x((d) => x(d.time))
          .y(({ state }) => Math.max(y(state[key as StateKey]), 0));

        plotGroup.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', color(state.color))
          .attr('stroke-width', 1.5)
          .attr('d', line);
      });

    return () => {
      d3.select(currentSvg).selectAll('*').remove();
    };
  }, [
    data, chart.simulationId,
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

  if (!((chart as LoadedChart).webR)) {
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
