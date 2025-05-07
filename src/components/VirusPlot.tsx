import { useSignals } from '@preact/signals-react/runtime';
import { DataElement, simulationId, simulationRun, simulationRunNumber } from '@state/input-controls';
import * as d3 from 'd3';
import { useRef } from 'react';
import styles from './VirusPlot.module.css';
import { useEffect } from 'preact/hooks';

type StateKey = 'S' | 'E' | 'I' | 'R'; //typeof infectionStateKeys[number];
type InfectionStateMap = Record<StateKey, {
  label: string;
  color: string;
}>;

const infectionStates: InfectionStateMap = {
  S: { label: 'Susceptible', color: '#1f77b4' },
  E: { label: 'Exposed', color: '#ff7f0e' },
  I: { label: 'Infected', color: '#2ca02c' },
  R: { label: 'Recovered', color: '#d62728' },
};

const area = {
  plot: {
    width: 600, // Width of the plot area including margins
    height: 500,  // Height of the plot area including the legend and margins
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 100,
    },
  },
  legend: {
    height: 100,
  },
}

const VirusPlot = () => {

  const svgRef = useRef<SVGSVGElement | null>(null);

  const data = simulationRun.value;
  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', area.plot.width)
      .attr('height', area.plot.height)
      .append('g')
      .attr('transform', `translate(${area.plot.margin.left},${area.plot.margin.right})`);

    const time = data.map((d) => d.time);

    const color = d3.scaleOrdinal<string>()
      .domain(Object.keys(infectionStates))
      .range(Object.values(infectionStates).map((state) => state.color));

    const x = d3.scaleLinear()
      .domain(d3.extent(time) as [number, number])
      .range([0, area.plot.width]);

    const yData = data.map((d) => ({
      S: d.S,
      E: d.E,
      I: d.I,
      R: d.R
    }))
    const y = d3.scaleLinear()
      .domain([
        d3.min(yData, (d) => Math.min(...Object.values(d).flat())) || 0,
        d3.max(yData, (d) => Math.max(...Object.values(d).flat())) || 0
      ])
      .nice()
      .range([area.plot.height - (area.legend.height + area.plot.margin.top + area.plot.margin.bottom), 20]);

    svg.append('g')
      .attr('transform', `translate(0, ${area.plot.height - (area.legend.height + area.plot.margin.top + area.plot.margin.bottom)})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    Object.entries(infectionStates)
      .filter(([key]) => key !== 'time') // Exclude Susceptible from the plot
      .forEach(([key, state]) => {
      const line = d3.line<DataElement>()
        .x((d) => x(d.time))
        .y((d) => Math.max(y(d[key as StateKey]), 0));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(state.color))
        .attr('stroke-width', 1.5)
        .attr('d', line);
    });

    // Adjust legend position and text color
    const runNumber = simulationRunNumber.value; //virusData.value.
    const legendSvg = svg.append('g')
      .attr('transform', `translate(${area.plot.margin.left}, ${area.plot.height - area.legend.height})`); // Move legend under the plot

    Object.entries(infectionStates).forEach(([_, state], index) => {
      const legendRow = legendSvg.append('g')
        .attr('transform', `translate(0, ${index * 20})`);

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(state.color));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .style('alignment-baseline', 'middle')
        .style('font-size', '0.9rem')
        .text(`Run ${runNumber}: ${state.label}`);
    });
    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data]);
  return (
    <div className={styles.root}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export { VirusPlot };
