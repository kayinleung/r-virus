import { Autorenew } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import { createNewRun, currentSimulationRunStatus, MultiRunStatuses } from "@state/simulation-runs";



const Refresh = () => {
  useSignals();

  const handleOnClick = () => {
    createNewRun();
  };

  const disableRerun = currentSimulationRunStatus.value !== MultiRunStatuses.COMPLETED;
  return (
    <Box component="form" sx={{
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignContent: 'flex-start',
      flexWrap: 'wrap',
      paddingX: '1rem'
    }}>
      <Fab disabled={disableRerun} color="primary" aria-label="rerun simulation with current parameters"
      onClick={handleOnClick}
      sx={{ alignSelf: 'center' }}>
        <Autorenew />
      </Fab>
    </Box>
  );
};

export { Refresh };
