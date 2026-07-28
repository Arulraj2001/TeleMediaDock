import type { DeviceRegistration } from '@mediadock/validation';

export class DeviceManagerService {
  private static INSTALLATION_ID_KEY = 'mediadock_installation_id';
  private static REGISTERED_DEVICES_KEY = 'mediadock_registered_devices';

  /**
   * Get or generate a random installation ID (UUID v4).
   * Privacy constraint: Zero hardware or OS fingerprinting.
   */
  public async getInstallationId(): Promise<string> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(DeviceManagerService.INSTALLATION_ID_KEY);
      if (stored[DeviceManagerService.INSTALLATION_ID_KEY]) {
        return stored[DeviceManagerService.INSTALLATION_ID_KEY];
      }
      const newId = crypto.randomUUID();
      await chrome.storage.local.set({ [DeviceManagerService.INSTALLATION_ID_KEY]: newId });
      return newId;
    }

    // Fallback for non-extension environments / tests
    let id = localStorage.getItem(DeviceManagerService.INSTALLATION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DeviceManagerService.INSTALLATION_ID_KEY, id);
    }
    return id;
  }

  /**
   * Register device installation with Supabase profile
   */
  public async registerDevice(deviceName = 'Chrome Extension'): Promise<DeviceRegistration> {
    const installationId = await this.getInstallationId();
    const device: DeviceRegistration = {
      installationId,
      deviceName,
      lastSeenAt: new Date().toISOString(),
    };

    const currentDevices = await this.getRegisteredDevices();
    const existingIndex = currentDevices.findIndex((d) => d.installationId === installationId);

    if (existingIndex >= 0) {
      currentDevices[existingIndex] = device;
    } else {
      currentDevices.push(device);
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [DeviceManagerService.REGISTERED_DEVICES_KEY]: currentDevices });
    } else {
      localStorage.setItem(DeviceManagerService.REGISTERED_DEVICES_KEY, JSON.stringify(currentDevices));
    }

    return device;
  }

  /**
   * List registered devices
   */
  public async getRegisteredDevices(): Promise<DeviceRegistration[]> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get(DeviceManagerService.REGISTERED_DEVICES_KEY);
      return stored[DeviceManagerService.REGISTERED_DEVICES_KEY] || [];
    }
    const raw = localStorage.getItem(DeviceManagerService.REGISTERED_DEVICES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Remove device registration
   */
  public async removeDevice(installationId: string): Promise<void> {
    const current = await this.getRegisteredDevices();
    const filtered = current.filter((d) => d.installationId !== installationId);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [DeviceManagerService.REGISTERED_DEVICES_KEY]: filtered });
    } else {
      localStorage.setItem(DeviceManagerService.REGISTERED_DEVICES_KEY, JSON.stringify(filtered));
    }
  }
}

export const DeviceManager = new DeviceManagerService();
