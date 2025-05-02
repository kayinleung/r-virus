/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebR } from 'webr';
import type { WebR as WebRType } from 'webr';
import { useEffect, useState } from 'preact/hooks';
// import { signal } from '@preact/signals-react';
import type { DataElement } from '../stream/webREventReader';
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { LoadingSpinner } from './LoadingSpinner';
import { VirusPlot } from './VirusPlot';
const rCode = (await import(`../R/mass-action.R?raw`)).default;

// const dataSignal = signal<DataElement[]>([]);
// const virusDataLength = computed(() => dataSignal.value.length);


export const WebRComponent = () => {
  const [webR, setWebR] = useState<WebRType|null>(null);
  const [dataSignal, setDataSignal] = useState<DataElement[]>([]);

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
      webR.writeConsole(rCode);
      for await (const item of readWebRDataElementsEvents(webR) ?? []) {
        setDataSignal((prev) => {
          const newData = [...prev, item];
          return newData;
        });
      }
    };

    compute();
  }, [webR]);

  // console.log("virusDataLength updated:", dataSignal); // Debugging log to track updates
  // const virusDataLengthValue = dataSignal.length;

  if (!webR) {
    return <LoadingSpinner text='Loading project...' />;
  };

  if (dataSignal.length === 0) { // Use the explicitly accessed value
    return <LoadingSpinner text='Starting simulation...' />;
  }

  return <VirusPlot dataSignal={dataSignal} />;
};
