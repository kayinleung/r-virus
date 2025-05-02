import type { DataElement } from '../stream/webREventReader';

type VirusPlotProps = {
  dataSignal: DataElement[];
};

const VirusPlot = ({ dataSignal }: VirusPlotProps) => {
  // const virusSignal = computed(() => dataSignal.value.length);
  return (
    <div>
      <h2>Virus Plot</h2>
      {/* <p>Length: {dataSignal.length}</p> */}
      <p>Data: {JSON.stringify(dataSignal)}</p>
    </div>
  );
}
export { VirusPlot };