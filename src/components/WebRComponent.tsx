/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WebR as WebRType } from 'webr';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';

import { useSignals } from '@preact/signals-react/runtime';
import { virusData, currentForm, simulationRuns, currentSimulationRunState, SimulaitonRunStates } from '@state/input-controls';
import { getWebR } from 'utils/R';


const rCode = (await import(`../R/mass-action.R?raw`)).default;

export const WebRComponent = () => {

  useSignals();
  currentSimulationRunState.value = 'LOADING_R';

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

      const parameterizedRCode = rCode
        .replace(/`\${population_size}`/g, String(currentForm.value.population))
        .replace(/`\${time_end}`/g, String(currentForm.value.timeEnd))
        .replace(/`\${transmission_rate}`/g, String(currentForm.value.transmissionRate))
        .replace(/`\${infectiousness_rate}`/g, String(currentForm.value.infectiousnessRate))
        .replace(/`\${recovery_rate}`/g, String(currentForm.value.recoveryRate))
        .replace(/`\${increment}`/g, String(currentForm.value.increment))
        .replace(/`\${seed_infected}`/g, String(currentForm.value.seedInfected));
      webR.flush();
      webR.writeConsole(parameterizedRCode);
      for await (const item of readWebRDataElementsEvents(webR) ?? []) {
        virusData.value = [...virusData.value, item];
        if (virusData.value.length >= currentForm.value.timeEnd) {
          currentSimulationRunState.value = SimulaitonRunStates.COMPLETED;
          break;
        }
      }
    };

    compute();
    currentSimulationRunState.value = SimulaitonRunStates.IN_PROGRESS;
  }, [webR, simulationRuns.value]);

  return <VirusPlotContainer webR={webR} />
};
