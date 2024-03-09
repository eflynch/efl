import styles from './magnolial.module.css';

/* eslint-disable-next-line */
export interface MagnolialProps {}

export function Magnolial(props: MagnolialProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Magnolial!</h1>
    </div>
  );
}

export default Magnolial;
