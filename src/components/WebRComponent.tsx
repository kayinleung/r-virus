import { VirusPlotContainer } from '@components/VirusPlotContainer';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import type { WebR as WebRType } from 'webr';
import { readWebRDataElementsEvents } from '../stream/webREventReader';

import { useSignals } from '@preact/signals-react/runtime';
import { ModelReferences, ModelTypes } from '@state/chart';
import { currentForm } from '@state/form-controls';
import { maxRunId, MultiRunStatuses, simulationRuns } from '@state/simulation-runs';
import { getWebR } from 'utils/R';

const rCode = (await import(`../R/model_reference.R?raw`)).default;

export const WebRComponent = () => {

  useSignals();

  const [webR, setWebR] = useState<WebRType>();

  useMemo(() => {
    const setupR = async () => {

      ModelTypes.forEach(async (modelType) => {
        simulationRuns.value = {
          ...simulationRuns.value,
          [maxRunId.value]: {
            ...simulationRuns.value[maxRunId.value],
            charts: [...simulationRuns.value[1].charts, {
              modelType,
              status: MultiRunStatuses.LOADING_R,
            },
            ]
          }
        };
      });
      const r = await getWebR();
      setWebR(r);
    };

    setupR();
  }, []);

  useEffect(() => {

    const compute = async ({webR, runId}: {webR?: WebRType, runId: number}) => {
      if( !webR ) {
        return;
      }
      const simulationId = uuidv4();
      const parameterizedRCode = rCode
        .replace(/`\${simulation_id}`/g, simulationId)
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
      
      simulationRuns.value = {
        ...simulationRuns.value,
        [runId]: {
          charts: [{
            modelType: ModelReferences.model_reference.value,
            status: MultiRunStatuses.IN_PROGRESS,
          }, {
            modelType: ModelReferences.model_network_poisson.value,
            status: MultiRunStatuses.IN_PROGRESS,
          }, {
            modelType: ModelReferences.model_network_negative_binomial.value,
            status: MultiRunStatuses.IN_PROGRESS,
          }],
          formValues: currentForm.value,
          status: MultiRunStatuses.IN_PROGRESS,
        }
      };
      webR.evalRVoid(parameterizedRCode, { captureStreams: false });
      readWebRDataElementsEvents({ webR });
    };
    compute({ webR, runId: maxRunId.value });
  }, [webR, maxRunId.value]);

  return <VirusPlotContainer />
};
