import { InfoMessage } from "../../entities";
import { StartIcon } from "../../shared";
import styles from "./start-block.module.css";

function StartBlock() {
  return (
    <div className={styles["start-block"]}>
      <StartIcon />
      <InfoMessage />
    </div>
  );
}

export { StartBlock };
