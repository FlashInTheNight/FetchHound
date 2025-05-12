// В chrome.storage.local храним объект вида:
export interface ExclusionMap {
  [host: string]: string[]; // host → массив URL, которые нужно игнорировать
}

// storage.ts
export const storage = {
  async getAll(): Promise<ExclusionMap> {
    return (await chrome.storage.local.get("exclusions")).exclusions || {};
  },
  async get(host: string): Promise<string[]> {
    const all = await this.getAll();
    return all[host] || [];
  },
  async add(host: string, url: string[]) {
    const all = await this.getAll();
    all[host] = Array.from(new Set([...(all[host] || []), ...url]));
    await chrome.storage.local.set({ exclusions: all }, () => {
      if (chrome.runtime.lastError) {
        console.error("Storage error:", chrome.runtime.lastError);
      }
    });
  },
  async remove(host: string, url: string) {
    const all = await this.getAll();
    all[host] = (all[host] || []).filter((u) => u !== url);
    await chrome.storage.local.set({ exclusions: all });
  },
  async clearSite(host: string) {
    const all = await this.getAll();
    delete all[host];
    await chrome.storage.local.set({ exclusions: all });
  },
  async clearAll() {
    await chrome.storage.local.remove("exclusions");
  },
};
