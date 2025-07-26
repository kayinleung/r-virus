import { PlayArrow } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import { createNewRun, currentSimulationRunStatus, displayedRunId, maxRunId, MultiRunStatuses } from "@state/simulation-runs";

import { passiveSupport } from 'passive-events-support/src/utils';

passiveSupport({
  debug: true,
  listeners: [
    {
      element: 'form.MuiBox-root > button',
      event: 'touchstart'
    }
  ]
});

const Refresh = () => {
  useSignals();

  const handleOnClick = () => {
    createNewRun();
    displayedRunId.value = maxRunId.value;;
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
        <PlayArrow />
      </Fab>
    </Box>
  );
};

export { Refresh };
