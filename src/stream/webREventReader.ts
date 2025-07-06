import { ModelType } from '@state/chart';
import type { DataElement, ErrorMessage } from '@state/form-controls';
import { executingSimulationRunNumber, LoadedChart, setSimulationRunStatus, simulationRuns, SimulationRunStatuses } from '@state/simulation-runs';
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
  modelType: ModelType;
  webR: WebRType;
}

export const readWebRDataElementsEvents = async ({webR, modelType}: EventReaderProps) => {
  webR.flush();

  for await (const item of webR.stream()) {
    if (item.type === 'stderr') {
      setSimulationRunStatus({
        modelType,
        status: SimulationRunStatuses.ERROR,
      });
      continue;
    }
    try {
      webR.flush();
      const parsedResult = extractJsonObject(item.data);
      console.log('webREventReader - item=', item);
      if (!parsedResult) {
        continue;
      }
      if((parsedResult as ParsedErrorMessage).isError) {
        setSimulationRunStatus({
          modelType,
          status: SimulationRunStatuses.ERROR,
        });
        continue;
      }
      const { dataElement } = parsedResult as ParsedDataMessage;


      const existingCharts = (simulationRuns.value[executingSimulationRunNumber.value].charts as LoadedChart[]);//.filter((chart) => Boolean(chart.simulationId));

      const simulationId = dataElement.simulation_id;
      const updatingChart = existingCharts.find((chart) => chart.simulationId === simulationId);
      if( !updatingChart ) {
        console.error(`Simulation with ID ${simulationId} not found in current run.`);
        return;
      }
      simulationRuns.value = {
        ...simulationRuns.value,
        [executingSimulationRunNumber.value]: {
          ...simulationRuns.value[executingSimulationRunNumber.value],
          charts: existingCharts.map((chart) =>
            chart.simulationId === simulationId
              ? {
                  ...updatingChart,
                  data: [...updatingChart.data, dataElement],
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
