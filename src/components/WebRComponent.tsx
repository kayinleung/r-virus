import type { WebR as WebRType } from 'webr';
import { useEffect, useMemo, useState } from 'preact/hooks'
import { readWebRDataElementsEvents } from '../stream/webREventReader';
import { VirusPlotContainer } from '@components/VirusPlotContainer';
import { v4 as uuidv4 } from 'uuid';

import { useSignals } from '@preact/signals-react/runtime';
import { currentForm } from '@state/form-controls';
import { getWebR } from 'utils/R';
import { ModelType, ModelTypes } from '@state/chart';
import { LoadingChart, maxRunId, MultiRunStatuses, simulationRuns, SimulationRunStatuses } from '@state/simulation-runs';

const rCodeModelReference = (await import(`../R/model_reference.R?raw`)).default;
const rCodeModelNetwork = (await import(`../R/model_network.R?raw`)).default;
const rCodeModelNetworkNB = (await import(`../R/model_network_NB.R?raw`)).default;

type WebRMap = Record<ModelType, WebRType | undefined>;

export const WebRComponent = () => {

  useSignals();

  const [webR, setWebR] = useState<WebRMap>({
    model_reference: undefined,
    model_network: undefined,
    model_network_nb: undefined,
  });

  useMemo(() => {
    const setupR = () => {

      ModelTypes.forEach(async (modelType) => {
        simulationRuns.value = {
          ...simulationRuns.value,
          [maxRunId.value]: {
            ...simulationRuns.value[maxRunId.value],
            charts: [...simulationRuns.value[maxRunId.value].charts, {
              modelType,
              status: MultiRunStatuses.LOADING_R,
            },
            ]
          }
        };
        const r = await getWebR();
        setWebR({
          ...webR,
          [modelType]: r,
        });
      });
    };

    setupR();
  }, []);

  useEffect(() => {

    const compute = async () => {
      ModelTypes.forEach(async (modelType) => {
        const r = webR[modelType];
        if( !r ) {
          return;
        }
        const simulationId = uuidv4();

        const rCode = modelType === 'model_reference' ?
          rCodeModelReference :
          (modelType === 'model_network' ?
            rCodeModelNetwork :
            rCodeModelNetworkNB
          );
        // const rCode = rCodeModelReference; // Default to model_reference for now
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
        

        const existingCharts = (simulationRuns.value[maxRunId.value].charts as LoadingChart[]);
        const updatingChart = existingCharts.find((chart) => chart.modelType === modelType);
        if( !updatingChart ) {
          console.error(`Simulation with model type of ${modelType} in run ${maxRunId.value} not found.`);
          return;
        }
        
        simulationRuns.value = {
          ...simulationRuns.value,
          [maxRunId.value]: {
            ...simulationRuns.value[1],
            formValues: currentForm.value,
            status: MultiRunStatuses.IN_PROGRESS,

          charts: existingCharts.map((chart) => 
            chart.modelType === modelType
              ? {
                  ...updatingChart,
                  data: [],
                  status: SimulationRunStatuses.IN_PROGRESS,
                  simulationId,
                  webR: webR[modelType],
                }
              : chart
            )
          }
        };
        r.evalRVoid(parameterizedRCode, { captureStreams: false });
        readWebRDataElementsEvents({webR: r, modelType});
      });
    };
    compute();
  }, [webR, maxRunId.value]);

  return <VirusPlotContainer />
};
