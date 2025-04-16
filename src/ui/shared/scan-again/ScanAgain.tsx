import { Button } from "../button/Button";
import style from "./scan-again.module.css";

function ScanAgain() {
  return (
    <div className={style["step-back"]}>
      <Button>Step back</Button>
    </div>
  );
}

export { ScanAgain };
