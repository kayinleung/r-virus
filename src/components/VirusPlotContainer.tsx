import type { WebR } from 'webr';

import { LoadingSpinner } from '@components/LoadingSpinner';
import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import styles from './VirusPlotContainer.module.css';
import { SimulationSelector } from './SimulationSelector';
import { currentSimulationRunState, SimulaitonRunStates, simulationRun } from '@state/simulation-runs';
import type { SimulationRunState } from '@state/simulation-runs';
import { MetricSelector } from './MetricSelector';

type VirusPlotContainerProps = {
  webR: WebR | null;
};

const VirusPlotContainer = ({ webR }: VirusPlotContainerProps) => {

  useSignals();
  const showSimulationSelector = [
    SimulaitonRunStates.COMPLETED,
  ].includes(currentSimulationRunState.value as SimulationRunState);

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

  if (simulationRun.value.length === 0) {
    return <LoadingSpinner text='Starting simulation...' />;
  }

  return (
    <>
      <VirusPlot title={'Reference'} />
      <VirusPlot title={'Network'} />
    </>
  );
};

export { VirusPlotContainer };