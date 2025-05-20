import { useExcludeGroupActions } from '../../../hooks';
import { CustomButton } from '../../shared';
import styles from './exclude-group-btns.module.css';

export const ExcludeGroupBtns = () => {
  const { handleSetMode, handleSaveAndRescan, loading } = useExcludeGroupActions();
  return (
    <div className={styles['group-btns']}>
      <CustomButton variant="outline" size="small" onClick={handleSetMode}>
        Cancel
      </CustomButton>
      <CustomButton size="small" onClick={handleSaveAndRescan} disabled={loading}>
        Save & Rescan
      </CustomButton>
    </div>
  );
};
