import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import styles from './VirusPlot.module.css';
import type { DataElement } from '../stream/webREventReader';
import { useSignals } from '@preact/signals-react/runtime';
import { dataSignal } from '@state/input-controls';


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

const VirusPlot = () => {
  useSignals();
  const data = dataSignal.value;
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // const legendWidth = 100;
    const margin = { top: 20, right: 130, bottom: 30, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const time = data.map((d) => d.time);

    const color = d3.scaleOrdinal<string>()
      .domain(Object.keys(infectionStates))
      .range(Object.values(infectionStates).map((state) => state.color));

    const x = d3.scaleLinear()
      .domain(d3.extent(time) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(...Object.values(d.state).flat())) || 0,
        d3.max(data, (d) => Math.max(...Object.values(d.state).flat())) || 0
      ])
      .nice()
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    Object.entries(infectionStates).forEach(([key, state]) => {
      const line = d3.line<DataElement>()
        .x((d) => x(d.time))
        .y((d) => Math.max(y(d.state[key as StateKey]), 0));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color(state.color))
        .attr('stroke-width', 1.5)
        .attr('d', line);
    });

    // Adjust legend position and text color
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 20)`); // Move legend to the right of the plot

    Object.entries(infectionStates).forEach(([_, state], index) => {
      const legendRow = legend.append('g')
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
        .text(state.label);
    });

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data]);

  return (
    <div className={styles.Root}>
      <h2>Virus Plot</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export { VirusPlot };