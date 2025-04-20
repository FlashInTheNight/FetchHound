import { useLoadingStore } from "../../../store";
import { InfoMessage } from "../../entities";
import { LoadingIcon, StartIcon } from "../../shared";
import styles from "./start-block.module.css";

function StartBlock() {
  const { loading } = useLoadingStore();
  return (
    <div className={styles["start-block"]}>
      {loading ? <LoadingIcon /> : <StartIcon />}
      <InfoMessage />
    </div>
  );
}

export { StartBlock };
