import { useMediaStore, useSelectedStore } from "../../../store";
import { CustomButton } from "../../shared";
import styles from "./group-btns.module.css";

function GroupBtns() {
  const removeAll = useSelectedStore((s) => s.removeAllChecked);
  const addAll = useSelectedStore((s) => s.addAllChecked);
  const { mediaItems } = useMediaStore();

  const handelAddAll = () => addAll(mediaItems);
  
  return (
    <div className={styles["group-btns"]}>
      <CustomButton variant="outline" size="small" onClick={handelAddAll}>
        Select All
      </CustomButton>
      <CustomButton variant="outline" size="small" onClick={removeAll}>
        Remove All
      </CustomButton>
      <CustomButton className={styles["group-btns__download-btn"]} size="small">
        Download
      </CustomButton>
    </div>
  );
}

export { GroupBtns };
