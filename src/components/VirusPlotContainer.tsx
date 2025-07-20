import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import { displayedRunId, displayedSimulationRun } from '@state/simulation-runs';
import { MetricSelector } from './MetricSelector';
import { SimulationSelector } from './SimulationSelector';
import styles from './VirusPlotContainer.module.css';
import { Legend } from './Legend';

const VirusPlotContainer = () => {

  return (
    <div className={styles.virusPlotContainerRoot}>
      <div className={styles.virusPlotDisplayOptions}>
        <SimulationSelector />
        <MetricSelector />
      </div>
      <MultiVirusPlot />
    </div>
  );
};

const MultiVirusPlot = () => {

  useSignals();

  return (
    <>
      <div className={styles.multiVirusPlotContainer}>
        {displayedSimulationRun.value.charts.map((chart) => {
          return <VirusPlot key={`${displayedRunId.value}-${chart.modelType}`} chart={chart} />
        })}
        { /* TODO: Add a fourth "all charts" plot */ }
      </div>
      <Legend/>
    </>
  );
};

export { VirusPlotContainer };
