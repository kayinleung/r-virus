import type { DataElement, ErrorMessage } from '@state/form-controls';
import { executingSimulationRunNumber, LoadedChart, simulationRuns, SimulationRunStatuses } from '@state/simulation-runs';
import type { WebR as WebRType } from 'webr';

export type ParsedDataMessage = {
  dataElement: DataElement;
  remainingString: string;
}
export type ParsedErrorMessage = {
  error: ErrorMessage;
  isError: true;
};

type ParsedMessage = ParsedDataMessage | ParsedErrorMessage;

export const extractJsonObject = (inputString: string): ParsedMessage | null => {
  // Regex to match a 2-level deep JSON object: { ... { ... } ... }
  const regex = /\{[^{}]*\{[^{}]*\}[^{}]*\}/;
  const match = inputString.match(regex);
  if (!match) {
    return null;
  }
  const jsonString = match[0];
  // console.log('webREventReader - jsonString=', jsonString);
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;
  try {
    const parsedMessage = JSON.parse(jsonString) as unknown;
    if(!(parsedMessage && typeof parsedMessage === 'object')) {
      return null;
    }
    if ('error' in parsedMessage) {
      return {
        ...parsedMessage,
        isError: true,
      } as ParsedErrorMessage;
    }
    if(typeof (parsedMessage as DataElement).state['S'] !== 'number') {
      return {
        error: {
          simulation_id: (parsedMessage as DataElement).simulation_id,
          message: 'NA data element',
        },
        isError: true,
      } as ParsedErrorMessage;
    }
    // console.log('webREventReader successful parse - parsedMessage=', parsedMessage);
    if ('state' in parsedMessage) {
      return {
        dataElement: parsedMessage as DataElement,
        remainingString: inputString.substring(endIndex),
      } as ParsedDataMessage;
    }

    return null;
  } catch (e) {
    console.error('webREventReader - Error parsing JSON:', e);
    return null;
  }
};

type EventReaderProps = {
  webR: WebRType;
}

export const readWebRDataElementsEvents = async ({webR}: EventReaderProps) => {
  webR.flush();

  for await (const item of webR.stream()) {
    // item: {type: 'stdout', data: '{"state":{"E":0.1292,"I":0.0853,"R":0.1653,"S":99.…0.0977},"time":0,"model_type":"model_reference"} '}
    // console.log('webREventReader  before parsing - item=', item);
    if (item.type === 'stderr') {
      // setSimulationRunStatus({
      //   modelType,
      //   status: SimulationRunStatuses.ERROR,
      // });
      continue;
    }
    try {
      webR.flush();
      const parsedResult = extractJsonObject(item.data);
      // console.log('webREventReader - parsedResult=', JSON.stringify(parsedResult));
      if (!parsedResult) {
        continue;
      }
      if((parsedResult as ParsedErrorMessage).isError) {
        continue;
      }
      const { dataElement } = parsedResult as ParsedDataMessage;
      const existingCharts = (simulationRuns.value[executingSimulationRunNumber.value].charts as LoadedChart[]);
      const updatingChart = existingCharts.find((chart) => chart.modelType === dataElement.model_type);
      
      
      if( !updatingChart ) {
        console.error(`Simulation of type ${dataElement.model_type} not found in current run - creating entry...`);

        // simulationRuns.value = {
        //   ...simulationRuns.value,
        //   [executingSimulationRunNumber.value]: {
        //     ...simulationRuns.value[executingSimulationRunNumber.value],
        //     charts: [
        //       ...existingCharts, {
        //         modelType: dataElement.model_type,
        //         data: [dataElement],
        //         status: dataElement.time < simulationRuns.value[executingSimulationRunNumber.value].formValues.timeEnd
        //           ? SimulationRunStatuses.IN_PROGRESS
        //           : SimulationRunStatuses.COMPLETED,
        //       },
        //     ],
        //   },
        // };
        // return;
      }

      // The chart already exists, so we update it
      console.log('webREventReader - existingCharts', existingCharts);
      simulationRuns.value = {
        ...simulationRuns.value,
        [executingSimulationRunNumber.value]: {
          ...simulationRuns.value[executingSimulationRunNumber.value],
          charts: existingCharts.map((chart) =>
            chart.modelType === dataElement.model_type
              ? {
                  ...chart,
                  data: [...(chart.data ?? []), dataElement],
                  status: dataElement.time < simulationRuns.value[executingSimulationRunNumber.value].formValues.timeEnd
                    ? SimulationRunStatuses.IN_PROGRESS
                    : SimulationRunStatuses.COMPLETED,
                }
              : chart
          ),
        },
      };
    } catch (error) {
      console.error('webREventReader - Error parsing data element - error=', error);
      // continue;
    }
  }
};
