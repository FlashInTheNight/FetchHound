import { useGroupBtnsActions } from '../../../hooks';
import { CustomButton } from '../../shared';
import styles from './group-btns.module.css';

const GroupBtns = () => {
  const { removeAll, handelAddAll, handleDownload, getSelectedCount } = useGroupBtnsActions();

  return (
    <div className={styles['group-btns']}>
      <CustomButton variant="outline" size="small" onClick={handelAddAll}>
        Select All
      </CustomButton>
      <CustomButton variant="outline" size="small" onClick={removeAll}>
        Remove All
      </CustomButton>
      <CustomButton
        onClick={handleDownload}
        disabled={getSelectedCount() === 0}
        className={styles['group-btns__download-btn']}
        size="small"
      >
        Download
      </CustomButton>
    </div>
  );
};

export { GroupBtns };
