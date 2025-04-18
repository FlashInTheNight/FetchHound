import { useMediaStore } from "../../../store";
import { Button } from "../button/Button";
import style from "./scan-again.module.css";

function ScanAgain() {
  const { setMediaItems } = useMediaStore();

  const clearMediaItems = () => setMediaItems([]);

  return (
    <div className={style["wrapper"]}>
      <Button onClick={clearMediaItems} textSize="small">
        Scan again
      </Button>
    </div>
  );
}

export { ScanAgain };
