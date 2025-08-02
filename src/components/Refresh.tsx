import { ActionIcon, type ActionIconProps } from "@mantine/core";
import { useSignals } from "@preact/signals-react/runtime";
import { createNewRun, currentSimulationRunStatus, displayedRunId, maxRunId, MultiRunStatuses } from "@state/simulation-runs";
import { IconPlayerPlay } from '@tabler/icons-react';

type RefreshProps = ActionIconProps;

const Refresh = (props: RefreshProps) => {
  useSignals();

  const handleOnClick = () => {
    createNewRun();
    displayedRunId.value = maxRunId.value;
  };

  const disableRerun = currentSimulationRunStatus.value !== MultiRunStatuses.COMPLETED;
  return (
    <ActionIcon
      disabled={disableRerun}
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
      variant="filled"
      size="xl"
      radius="xl"
      aria-label="Settings"
      onClick={handleOnClick}
      {...props}
    >
      <IconPlayerPlay />
    </ActionIcon>
  );
};

export { Refresh };
