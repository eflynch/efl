import styles from './neck-components.module.css';

/* eslint-disable-next-line */
export interface NeckComponentsProps {}

export function NeckComponents(props: NeckComponentsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to NeckComponents!</h1>
    </div>
  );
}

export default NeckComponents;
