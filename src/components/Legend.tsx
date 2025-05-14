import { infectionStates } from '@state/chart';
import styles from './Legend.module.css';

const Legend = () => {
  return (
    <div className={styles.legendRoot}>
      {Object.entries(infectionStates).map(([key, state]) => (
        <div key={key} className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: state.color }} />
          <span className={styles.legendLabel}>{state.label}</span>
        </div>
      ))}
    </div>
  );
};

export { Legend };