import { Autorenew } from "@mui/icons-material"
import { Box, Fab } from "@mui/material"
import { useSignals } from "@preact/signals-react/runtime";
import { currentForm} from "@state/form-controls";
import { currentSimulationRunState, plottedSimulationId, SimulaitonRunStates, simulationId, simulationRuns  } from "@state/simulation-runs";
import { v4 as uuidv4 } from "uuid";



const Refresh = () => {
  useSignals();

  const handleOnClick = () => {
    console.log('Refresh - currentForm=', currentForm);

    const uuid = uuidv4();
    const currentNumberOfRuns = simulationRuns.value[simulationId.value]?.runNumber;
    simulationRuns.value[uuid] = {
      formValues: {
        ...currentForm.value,
      },
      results: [],
      runNumber: currentNumberOfRuns + 1,
    };
    simulationId.value = uuid; // triggers a new simulation
    plottedSimulationId.value = uuid; // update the chart to show the new simulation

    currentSimulationRunState.value = SimulaitonRunStates.IN_PROGRESS;
  };

  const showButton = currentSimulationRunState.value !== SimulaitonRunStates.LOADING_R;
  const disableRerun = currentSimulationRunState.value === SimulaitonRunStates.IN_PROGRESS;
  return showButton ? (
    <Box component="form" sx={{
      position: 'absolute',
      top: '0.5rem',
      right: '1.5rem',
    }}>
      <Fab disabled={disableRerun} color="primary" aria-label="rerun simulation with current parameters"
      onClick={handleOnClick}
      sx={{ alignSelf: 'center' }}>
        <Autorenew />
      </Fab>
    </Box>
  ) : null;
};

export { Refresh };