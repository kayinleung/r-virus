import type { WebR as WebRType } from 'webr';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';

import { useSignals } from '@preact/signals-react/runtime';
import { currentForm } from '@state/form-controls';
import { getWebR } from 'utils/R';
import { simulationId } from '@state/simulation-runs';

const rCodeModelReference = (await import(`../R/model_reference.R?raw`)).default;
const rCodeModelNetwork = (await import(`../R/model_network.R?raw`)).default;
const rCodeModelNetworkNB = (await import(`../R/model_network_NB.R?raw`)).default;


export const WebRComponent = () => {

  useSignals();

  const [webR, setWebR] = useState<WebRType|null>(null);

  useMemo(() => {
    const setupR = async () => {
      const r = await getWebR();
      setWebR(r);
    };
    setupR();
  }, []);

  useEffect(() => {
    if (!webR) return;

    const compute = async () => {
      const rCode = currentForm.value.modelType === 'model_reference' ? rCodeModelReference : currentForm.value.modelType === 'model_network' ? rCodeModelNetwork : rCodeModelNetworkNB;
      const parameterizedRCode = rCode
        .replace(/`\${population_size}`/g, String(currentForm.value.populationSize))
        .replace(/`\${serial_interval}`/g, String(currentForm.value.serialInterval))
        .replace(/`\${time_end}`/g, String(currentForm.value.timeEnd))
        .replace(/`\${model_type}`/g, currentForm.value.modelType)
        .replace(/`\${reproduction_number}`/g, String(currentForm.value.reproductionNumber))
        .replace(/`\${increment}`/g, String(currentForm.value.increment))
        .replace(/`\${mu}`/g, String(currentForm.value.mu))
        .replace(/`\${dispersion}`/g, String(currentForm.value.dispersion))
        .replace(/`\${seed_infected}`/g, String(currentForm.value.seedInfected))
        .replace(/`\${serial_interval}`/g, String(currentForm.value.serialInterval))
        .replace(/`\${degree_distribution}`/g, currentForm.value.degreeDistribution);
      webR.flush();
      webR.evalRVoid(parameterizedRCode, { captureStreams: false });
      readWebRDataElementsEvents(webR)
    };
    compute();
  }, [webR, simulationId.value]);

  return <VirusPlotContainer webR={webR} />
};
