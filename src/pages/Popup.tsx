import { useExtensionMode } from '../store';
import { SettingsMenu } from '../ui/entities';
import { MediaListWidjet, StartBlockWidjet } from '../ui/widgets';
import style from './popup.module.css';

const Popup = () => {
  const { mode } = useExtensionMode();

  return (
    <main className={style['app-wrapper']}>
      <header className={style.header}>
        <h1 className={style.title}>Media Downloader</h1>
        <SettingsMenu />
      </header>
      {mode === 'scan' ? <StartBlockWidjet /> : <MediaListWidjet />}
    </main>
  );
};

export default Popup;
