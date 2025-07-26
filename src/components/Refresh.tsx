import { ActionIcon } from "@mantine/core";
import { useSignals } from "@preact/signals-react/runtime";
import { createNewRun, currentSimulationRunStatus, displayedRunId, maxRunId, MultiRunStatuses } from "@state/simulation-runs";

import { IconPlayerPlay } from '@tabler/icons-react';

const Refresh = () => {
  useSignals();

  const handleOnClick = () => {
    createNewRun();
    displayedRunId.value = maxRunId.value;;
  };

  const disableRerun = currentSimulationRunStatus.value !== MultiRunStatuses.COMPLETED;
  return (
    <ActionIcon disabled={disableRerun} variant="filled" aria-label="Settings" onClick={handleOnClick}>
      <IconPlayerPlay style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  );
};

export { Refresh };
