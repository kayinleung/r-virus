import type { WebR } from 'webr';

import { LoadingSpinner } from '@components/LoadingSpinner';
import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import { displayedSimulationRun } from '@state/simulation-runs';
import { MetricSelector } from './MetricSelector';
import { SimulationSelector } from './SimulationSelector';
import styles from './VirusPlotContainer.module.css';
import { Legend } from './Legend';
import { ModelReferences } from '@state/chart';

type VirusPlotContainerProps = {
  webR: WebR | null;
};

const VirusPlotContainer = ({ webR }: VirusPlotContainerProps) => {

  // useSignals();
  // const showSimulationSelector = [
  //   SimulaitonRunStates.COMPLETED,
  // ].includes(currentSimulationRunStatus.value as SimulationRunState);

  return (
    <div className={styles.virusPlotContainerRoot}>
      <div className={styles.virusPlotDisplayOptions}>
        <SimulationSelector />
        <MetricSelector />
      </div>
      <MultiVirusPlot webR={webR} />
    </div>
  );

};
const MultiVirusPlot = ({ webR }: VirusPlotContainerProps) => {

  useSignals();

  if (!webR) {
    return <LoadingSpinner text='Loading project...' />;
  };

  return (
    <>
      <div className={styles.multiVirusPlotContainer}>
        {Object.entries(displayedSimulationRun.value.results).map(([simulationId, result]) => {
          return <VirusPlot simulationId={simulationId} title={ModelReferences[result.modelType].label} />
        })}
      </div>
      <Legend/>
    </>
  );
};

export { VirusPlotContainer };
