import { lineStyles, ModelReferences, mouseMetrics, mouseX, selectedMetric, StateKeys } from '@state/chart';
import styles from './Legend.module.css';
import { Paper, Title, Text } from '@mantine/core';
import { useSignals } from '@preact/signals-react/runtime';
import { useMediaQuery } from '@mantine/hooks';

const Legend = () => {
  useSignals();
  const matchesMediumAndUp = useMediaQuery('(min-width: 800px)');
  return (
    <><Paper shadow="xs" p="sm" className={styles.legendRoot}>
      <Title order={3}>{StateKeys[selectedMetric.value].label}{mouseX.value && `: t = ${Math.floor(mouseMetrics.value.t ?? 0)}`}</Title>
      {!(mouseMetrics.value && mouseX.value) && <Text>{matchesMediumAndUp ? 'Hover over a plot to see the legend.' : 'Drag on the plot to see the legend.'}</Text>}
      {(mouseMetrics.value && mouseX.value) && Object.entries(mouseMetrics.value)
        .filter((k) => k[0] !== 't')
        .sort(([a], [b]) => {
          return ModelReferences[a as keyof typeof ModelReferences].order - ModelReferences[b as keyof typeof ModelReferences].order;
        })
        .map(([k, value]) => {
          const metricLabel = ModelReferences[k as keyof typeof ModelReferences].label;
          if (!metricLabel) return null; // Skip if no label found

          return (
            <>
              <div key={`legend-${k}`} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: lineStyles[k as keyof typeof lineStyles].color }} />
                <span>{metricLabel}</span>: {value && <strong>{Math.floor(value)}</strong>}
              </div>
            </>
          );
        })}
      </Paper>
      <Paper shadow="xs" p="sm" className={styles.legendRoot}>
      <Title order={3}>{StateKeys.R.label}{mouseX.value && `: t = 100`}</Title>
        {/* TODO: JFisher - get the end chart value and show it in legend */}
        {/* {displayedSimulationRun.value.charts.filter((c) => c.modelType === ModelReferences.all.value)} */}
        {(mouseMetrics.value && mouseX.value) && Object.entries(mouseMetrics.value)
        .filter((k) => k[0] !== 't')
        .sort(([a], [b]) => {
          return ModelReferences[a as keyof typeof ModelReferences].order - ModelReferences[b as keyof typeof ModelReferences].order;
        })
        .map(([k, value]) => {
          const metricLabel = ModelReferences[k as keyof typeof ModelReferences].label;
          if (!metricLabel) return null; // Skip if no label found

          return (
            <>
              <div key={`legend-time-end-${k}`} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: lineStyles[k as keyof typeof lineStyles].color }} />
                <span>{metricLabel}</span>: {value && <strong>{Math.floor(value)}</strong>}
              </div>
            </>
          );
        })}
      </Paper>
    </>
  );
};

export { Legend };