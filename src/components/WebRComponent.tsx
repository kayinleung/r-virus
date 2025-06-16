import type { WebR as WebRType } from 'webr';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';

import { useSignals } from '@preact/signals-react/runtime';
import { currentForm } from '@state/form-controls';
import { getWebR } from 'utils/R';
import { currentSimulationRunState, SimulaitonRunStates, simulationRuns, simulationId } from '@state/simulation-runs';


const rCodeModelReference = (await import(`../R/model_reference.R?raw`)).default;
const rCodeModelNetwork = (await import(`../R/model_network.R?raw`)).default;

export const WebRComponent = () => {

  useSignals();
  
  currentSimulationRunState.value = SimulaitonRunStates.LOADING_R

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
      currentSimulationRunState.value = SimulaitonRunStates.IN_PROGRESS;
      const rCode = currentForm.value.modelType === 'model_reference' ? rCodeModelReference : rCodeModelNetwork;
      const parameterizedRCode = rCode
        .replace(/`\${population_size}`/g, String(currentForm.value.populationSize))
        .replace(/`\${time_end}`/g, String(currentForm.value.timeEnd))
        .replace(/`\${transmission_rate}`/g, String(currentForm.value.transmissionRate))
        .replace(/`\${model_type}`/g, currentForm.value.modelType)
        .replace(/`\${infectiousness_rate}`/g, String(currentForm.value.infectiousnessRate))
        .replace(/`\${recovery_rate}`/g, String(currentForm.value.recoveryRate))
        .replace(/`\${increment}`/g, String(currentForm.value.increment))
        .replace(/`\${lambda}`/g, String(currentForm.value.lambda))
        .replace(/`\${seed_infected}`/g, String(currentForm.value.seedInfected))
        .replace(/`\${degree_distribution}`/g, currentForm.value.degreeDistribution);
      webR.flush();
      currentSimulationRunState.value = SimulaitonRunStates.IN_PROGRESS;
      webR.writeConsole(parameterizedRCode);
      for await (const item of readWebRDataElementsEvents(webR) ?? []) {
        
        simulationRuns.value = {
          ...simulationRuns.value,
          [simulationId.value]: {
            ...simulationRuns.value[simulationId.value],
            results: [...(simulationRuns.value[simulationId.value].results ?? []), item],
          },
        }
        if (item.time >= currentForm.value.timeEnd) {
          currentSimulationRunState.value = SimulaitonRunStates.COMPLETED;
          break;
        }
      }
    };

    compute();
  }, [webR, simulationId.value]);

  return <VirusPlotContainer webR={webR} />
};
