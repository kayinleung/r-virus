import type { WebR } from 'webr';

import { LoadingSpinner } from '@components/LoadingSpinner';
import { VirusPlot } from '@components/VirusPlot';
import { useSignals } from '@preact/signals-react/runtime';
import { dataSignal } from '@state/input-controls';

type VirusPlotContainerProps = {
  webR: WebR | null;
};
const VirusPlotContainer = ({ webR }: VirusPlotContainerProps) => {

  useSignals();

  
  if (!webR) {
    return <LoadingSpinner text='Loading project...' />;
  };

  if (dataSignal.value.length === 0) { // Use the explicitly accessed value
    return <LoadingSpinner text='Starting simulation...' />;
  }

  return <VirusPlot />;
};

export { VirusPlotContainer };