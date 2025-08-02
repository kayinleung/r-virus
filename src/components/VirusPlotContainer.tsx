import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import { displayedRunId, displayedSimulationRun, type Chart } from '@state/simulation-runs';
import { Legend } from './Legend';
import { MetricSelector } from './MetricSelector';
import { SimulationSelector } from './SimulationSelector';
import styles from './VirusPlotContainer.module.css';
import { ModelReferences } from '@state/chart';

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

  return (
    <div className={styles.multiVirusPlotContainer}>
      {displayedSimulationRun.value.charts
      .sort((a, b) => {
        return ModelReferences[a.modelType].order - ModelReferences[b.modelType].order;
      })
      .map((chart) => {
        return <VirusPlot key={`${displayedRunId.value}-${chart.modelType}`} chart={chart} />
      })}
    </div>
  );
};

export { VirusPlotContainer };
