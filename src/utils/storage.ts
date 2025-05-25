import browser from 'webextension-polyfill';

export interface ExclusionMap {
  [host: string]: string[];
}
// This file is responsible for managing the storage of excluded URLs in the Chrome extension.
export const storage = {
  async getAll(): Promise<ExclusionMap> {
    return (await browser.storage.local.get('exclusions')).exclusions || {};
  },
  async get(host: string): Promise<string[]> {
    const all = await this.getAll();
    return all[host] || [];
  },
  async add(host: string, url: string[]) {
    const all = await this.getAll();
    all[host] = Array.from(new Set([...(all[host] || []), ...url]));
    await browser.storage.local.set({ exclusions: all });
  },
  async clearSite(host: string) {
    const all = await this.getAll();
    delete all[host];
    return new Promise<void>((resolve, reject) => {
      browser.storage.local.set({ exclusions: all }).then(resolve).catch(reject);
    });
  },
  async clearAll() {
    return new Promise<void>((resolve, reject) => {
      browser.storage.local.remove('exclusions').then(resolve).catch(reject);
    });
  },
};
