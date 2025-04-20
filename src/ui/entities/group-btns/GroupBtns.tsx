import { CustomButton } from "../../shared";
import styles from "./group-btns.module.css";

function GroupBtns() {
  return (
    <div className={styles["group-btns"]}>
      <CustomButton variant="outline" size="small">
        Select All
      </CustomButton>
      <CustomButton variant="outline" size="small">
        Remove All
      </CustomButton>
      <CustomButton className={styles["group-btns__download-btn"]} size="small">
        Download
      </CustomButton>
    </div>
  );
}

export { GroupBtns };
