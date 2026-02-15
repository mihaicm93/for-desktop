import { contextBridge, ipcRenderer } from "electron";

import { version } from "../../package.json";

contextBridge.exposeInMainWorld("native", {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    desktop: () => version,
  },

  minimise: () => ipcRenderer.send("minimise"),
  maximise: () => ipcRenderer.send("maximise"),
  close: () => ipcRenderer.send("close"),

  setBadgeCount: (count: number) => ipcRenderer.send("setBadgeCount", count),
  // Allow renderer to receive update events from main and send messages back.
  on: (channel: string, listener: (...args: any[]) => void) => {
    const allowed = new Set(["update-downloaded"]);
    if (!allowed.has(channel)) return;
    ipcRenderer.on(channel, (_e, ...args) => listener(...args));
  },
  send: (channel: string, ...args: any[]) => {
    const allowed = new Set(["restart-app"]);
    if (!allowed.has(channel)) return;
    ipcRenderer.send(channel, ...args);
  },
});
