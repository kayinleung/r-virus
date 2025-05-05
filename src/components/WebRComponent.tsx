/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebR } from 'webr';
import type { WebR as WebRType } from 'webr';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';

import { useSignals } from '@preact/signals-react/runtime';
import { dataSignal, population, simulationRuns } from '@state/input-controls';
import { getWebR } from 'utils/R';


const rCode = (await import(`../R/mass-action.R?raw`)).default;

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

  useMemo(() => {
    if (!webR) return;

    const compute = async () => {

      const parameterizedRCode = rCode
        .replace(/`\${population_size}`/g, String(population.value));
      webR.writeConsole(parameterizedRCode);
      for await (const item of readWebRDataElementsEvents(webR) ?? []) {
        dataSignal.value = [...dataSignal.value, item];
      }
    };

    compute();
  }, [webR, simulationRuns.value]);

  return <VirusPlotContainer webR={webR} />
};
