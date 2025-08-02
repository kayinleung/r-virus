import { lineStyles, ModelReferences, mouseMetrics, mouseX, selectedMetric, StateKeys } from '@state/chart';
import styles from './Legend.module.css';
import { Paper, Title, Text } from '@mantine/core';
import { useSignals } from '@preact/signals-react/runtime';

const Legend = () => {
  useSignals();
  return (
    <Paper p="sm" className={styles.legendRoot}>
      <Title order={3}>{StateKeys[selectedMetric.value].label}{mouseX.value && `: t = ${Math.floor(mouseX.value)}`}</Title>
      {!(mouseMetrics.value && mouseX.value) && <Text>Hover over a plot to see the legend.</Text>}
      {(mouseMetrics.value && mouseX.value) && Object.entries(mouseMetrics.value)
      .sort(([a], [b]) => {
        return ModelReferences[a as keyof typeof ModelReferences].order - ModelReferences[b as keyof typeof ModelReferences].order;
      })
      .map(([k, value]) => {
        const metricLabel = ModelReferences[k as keyof typeof ModelReferences].label;
        if (!metricLabel) return null; // Skip if no label found

        return (
          <div key={`legend-${k}`} className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundColor: lineStyles[k as keyof typeof lineStyles].color }} />
            <span>{metricLabel}</span>: {value && <strong>{Math.floor(value)}</strong>}
          </div>
        );
      })}
    </Paper>
  );
};

export { Legend };