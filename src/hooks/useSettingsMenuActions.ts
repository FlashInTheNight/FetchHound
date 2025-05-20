import { useState } from 'react';
import { storage } from '../utils/storage';

export const useSettingsMenuActions = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState({ clearSite: '', clearAll: '' });
  const [message, setMessage] = useState({ clearSite: '', clearAll: '' });

  const handleClearSiteExclusions = async () => {
    try {
      setError(prev => ({
        ...prev,
        clearSite: '',
      }));
      setMessage(prev => ({
        ...prev,
        clearSite: '',
      }));

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      let host;
      if (tab.url) {
        host = new URL(tab.url).host;
      } else {
        throw new Error('Failed to clear the list, make sure you are on the desired site');
      }
      await storage.clearSite(host);
      setMessage(prev => ({
        ...prev,
        clearSite: `Exclusions for ${tab.url} have been cleared.`,
      }));
    } catch (err) {
      const e =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while clearing site exclusions.';
      setError(prev => ({
        ...prev,
        clearSite: e,
      }));
    }
  };

  const handleClearAllExclusions = async () => {
    try {
      setError(prev => ({
        ...prev,
        clearAll: '',
      }));
      setMessage(prev => ({
        ...prev,
        clearAll: '',
      }));

      await storage.clearAll();

      setMessage(prev => ({
        ...prev,
        clearAll: 'All exclusions have been cleared.',
      }));
    } catch (err) {
      const e =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while clearing all exclusions.';
      setError(prev => ({
        ...prev,
        clearAll: e,
      }));
    }
  };

  return {
    handleClearSiteExclusions,
    handleClearAllExclusions,
    settingsOpen,
    setSettingsOpen,
    error,
    message,
  };
};
