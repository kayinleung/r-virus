import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import { ModelReferences } from '@state/chart';
import { displayedRunId, displayedSimulationRun, type Chart, type LoadedChart } from '@state/simulation-runs';
import { MetricSelector } from './MetricSelector';
import { SimulationSelector } from './SimulationSelector';
import styles from './VirusPlotContainer.module.css';
import { useMediaQuery } from '@mantine/hooks';

const VirusPlotContainer = () => {

  return (
    <div className={styles.virusPlotContainerRoot}>
      <div className={styles.virusPlotDisplayOptions}>
        <SimulationSelector className={styles.simulationSelector}/>
        <MetricSelector />
      </div>
      <MultiVirusPlot />
    </div>
  );
};

const MultiVirusPlot = () => {

  useSignals();
  const matchesMediumAndUp = useMediaQuery('(min-width: 800px)');

  /* if on mobile only show the "all" chart */
  const charts = matchesMediumAndUp ? displayedSimulationRun.value.charts : displayedSimulationRun.value.charts.filter((c) => c.modelType === ModelReferences.all.value);

  if(!charts || charts.length === 0) return;

  return (
    <div className={styles.multiVirusPlotContainer}>
      {charts.sort((a, b) => {
        return ModelReferences[a.modelType].order - ModelReferences[b.modelType].order;
      })
      .map((chart) => {
        return <VirusPlot key={`${displayedRunId.value}-${chart.modelType}`} chart={chart} />
      })}
    </div>
  );
};

export { VirusPlotContainer };
