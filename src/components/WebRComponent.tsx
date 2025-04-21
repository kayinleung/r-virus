/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebR } from 'webr';
import type { WebR as WebRType } from 'webr';
import { useEffect, useState } from 'react';
import { computed, signal } from '@preact/signals-react';
import { DataElement, readWebREvents } from '../stream/webREventReader';
const rCode = (await import(`../R/mass-action.R?raw`)).default;

const dataSignal = signal<DataElement[]>([]);
const simpleDataSignal = signal<string>('');
const displayResult = computed(() => dataSignal.value.length);
const simpleDisplayResult = computed(() => simpleDataSignal.value.length);


export const WebRComponent = () => {
  const [webR, setWebR] = useState<WebRType|null>(null);

  useEffect(() => {
    const setupR = async () => {
      const r = new WebR({ baseUrl: 'https://webr.r-wasm.org/latest/' });

      try {
        await r.init();
        // await r.installPackages(['jsonlite', 'http://localhost:5173/github-proxy/rivm-syso/escape2024/legacy.tar.gz/HEAD'], {
        //   quiet: false,
        // });
        await r.installPackages(['jsonlite', 'pak'], {
          quiet: false,
        });
        console.log("Packages installed successfully");
      } catch (error) {
        console.error("Error installing packages:", error);
        throw error;
      }
      setWebR(r);
    };
    setupR();
  }, []);

  useEffect(() => {
    if (!webR) return;

    // const compute = async () => {
    //   webR.writeConsole(rCode);
    //   for await (const item of readWebREvents(webR) ?? []) {
    //     dataSignal.value = [...dataSignal.value, item];
    //   }
    // };
    const compute = async () => {
      webR.writeConsole(rCode);
      for await (const item of readWebREvents(webR) ?? []) {
        simpleDataSignal.value = item;
      }
    };

    compute();
  }, [webR]);

  if(!webR) {
    return <div>Loading...</div>;
  };

  return (
    <div>
      <h2>WebR Component: {simpleDisplayResult}</h2>
    </div>
  );
};
