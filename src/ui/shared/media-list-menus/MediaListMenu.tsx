import { Button } from "../button/Button";
import style from "./media-list-menu.module.css";

function MediaListMenu() {

  
  return (
    <div className={style["media-list-menu"]}>
      <Button onClick={handleSelectAll}>Select All</Button>
      {/* <button onClick={handleSelectAll}>Select All</button> */} */}
      {/* <button onClick={handleDownload} style={{ marginLeft: "5px" }}>
      Download Selected
    </button>
    </div>
  );
}

export { MediaListMenu };
