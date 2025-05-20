// В chrome.storage.local храним объект вида:
export interface ExclusionMap {
  [host: string]: string[]; // host → массив URL, которые нужно игнорировать
}

// storage.ts
export const storage = {
  async getAll(): Promise<ExclusionMap> {
    return (await chrome.storage.local.get('exclusions')).exclusions || {};
  },
  async get(host: string): Promise<string[]> {
    const all = await this.getAll();
    return all[host] || [];
  },
  async add(host: string, url: string[]) {
    const all = await this.getAll();
    all[host] = Array.from(new Set([...(all[host] || []), ...url]));
    await chrome.storage.local.set({ exclusions: all });
  },
  async clearSite(host: string) {
    const all = await this.getAll();
    delete all[host];
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.set({ exclusions: all }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },
  async clearAll() {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.remove('exclusions', () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },
};
