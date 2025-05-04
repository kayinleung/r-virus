/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebR } from 'webr';
import type { WebR as WebRType } from 'webr';
import { useEffect, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';

import { useSignals } from '@preact/signals-react/runtime';
import { dataSignal, population } from '@state/input-controls';


const rCode = (await import(`../R/mass-action.R?raw`)).default;

export const WebRComponent = () => {

  useSignals();

  const [webR, setWebR] = useState<WebRType|null>(null);

  useEffect(() => {
    const setupR = async () => {
      const r = new WebR({ baseUrl: 'https://webr.r-wasm.org/latest/' });
      await r.init();
      await r.installPackages(['PBSddesolve', 'escape2024', 'jsonlite'], {
        repos: ['https://jgf5013.r-universe.dev', 'https://r-forge.r-universe.dev', 'https://karlines.r-universe.dev', 'https://repo.r-wasm.org'],
        quiet: false,
      });
      console.log("Packages installed successfully");
      setWebR(r);
    };
    setupR();
  }, []);

  useEffect(() => {
    if (!webR) return;

    const compute = async () => {

      const parameterizedRCode = rCode
        .replace(/`\${population_size}`/g, String(population.value));
      webR.writeConsole(parameterizedRCode);
      for await (const item of readWebRDataElementsEvents(webR) ?? []) {
        // setDataSignal((prev) => {
        //   const newData = [...prev, item];
        //   return newData;
        // });
        dataSignal.value = [...dataSignal.value, item];
      }
    };

    compute();
  }, [webR, population.value]);

  return <VirusPlotContainer webR={webR} />
};
