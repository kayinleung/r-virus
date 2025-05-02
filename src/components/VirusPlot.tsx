import type { DataElement } from '../stream/webREventReader';
import { computed, Signal } from '@preact/signals-core';

type VirusPlotProps = {
  dataSignal: Signal<DataElement[]>;
};

const VirusPlot = ({ dataSignal }: VirusPlotProps) => {
  const virusSignal = computed(() => dataSignal.value.length);
  return (
    <div>
      <h2>Virus Plot</h2>
      <p>Length: {virusSignal}</p>
    </div>
  );
}
export { VirusPlot };