import { ModelReferences } from '@state/chart';
import type { DataElement, DataElementError, ErrorMessage } from '@state/form-controls';
import { executingSimulationRunNumber, LoadedChart, simulationRuns, SimulationRunStatuses } from '@state/simulation-runs';
import { mode } from 'd3';
import type { WebR as WebRType } from 'webr';

export type ParsedDataMessage = {
  dataElement: DataElement;
  remainingString: string;
}
export type ParsedErrorMessage = {
  dataElement: DataElementError;
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
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;
  try {
    const parsedMessage = JSON.parse(jsonString) as unknown;
    if(!(parsedMessage && typeof parsedMessage === 'object')) {
      return null;
    }
    if(typeof (parsedMessage as DataElement).state?.['S'] !== 'number') {
      const message = parsedMessage as DataElementError;
      console.error('webREventReader - Invalid data element - missing or invalid state.S');
      return {
        dataElement: {
          model_type: message?.model_type
        },
        isError: true,
      } as ParsedErrorMessage;
    }
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
    console.log('webREventReader - item=', item);
    if (item.type === 'stderr') {
      const parsedResult = extractJsonObject(item.data);
      // const { dataElement } = parsedResult ?? {};
      if ((parsedResult as ParsedErrorMessage)?.isError) {
        console.log(`stopping ${parsedResult?.dataElement.model_type}!!!`);
      }
    }
    try {
      webR.flush();
      const parsedResult = extractJsonObject(item.data);
      if (!parsedResult) {
        continue;
      }
      // if((parsedResult as ParsedErrorMessage).isError) {
      //   console.log('webREventReader - Skipping error message');
      //   continue;
      // }
      const { dataElement } = parsedResult as ParsedDataMessage;
      const existingCharts = (simulationRuns.value[executingSimulationRunNumber.value].charts as LoadedChart[]);
      const updatingChart = existingCharts.find((chart) => chart.modelType === dataElement.model_type);
      
      
      if( !updatingChart ) {
        console.error(`Simulation of type ${dataElement.model_type} not found in current run - creating entry...`);
      }

      const isChartInProgress = dataElement.time < simulationRuns.value[executingSimulationRunNumber.value].formValues.timeEnd;
      const isChartInError = (parsedResult as ParsedErrorMessage).isError;
      const chartStatus = isChartInError ? SimulationRunStatuses.ERROR :
        (isChartInProgress ? SimulationRunStatuses.IN_PROGRESS : SimulationRunStatuses.COMPLETED);

      // The chart already exists, so we update it
      simulationRuns.value = {
        ...simulationRuns.value,
        [executingSimulationRunNumber.value]: {
          ...simulationRuns.value[executingSimulationRunNumber.value],
          charts: existingCharts.map((chart) =>
          (chart.modelType === dataElement.model_type || chart.modelType === 'all')
              ? {
                  ...chart,
                  data: [...(chart.data ?? []), dataElement],
                  status: chartStatus,
                }
              : chart
          ),
        },
      };
    } catch (error) {
      console.error('webREventReader - Error parsing data element - error=', error);
    }
  }
};
