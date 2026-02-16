import { Injectable } from "@angular/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

declare var cordova: any;

@Injectable({
  providedIn: "root",
})
export class FileAccessService {
  private whatsappStatusPath =
    "/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses";
  // Also check legacy path
  private legacyWhatsappStatusPath =
    "/storage/emulated/0/WhatsApp/Media/.Statuses";

  private destinationFolder = "SavedStatuses";

  constructor() {}

  /**
   * Request storage permissions for Android
   */
  async requestStoragePermission(): Promise<boolean> {
    try {
      if (Capacitor.getPlatform() === "android") {
        const permissions = await Filesystem.requestPermissions();

        if (permissions.publicStorage === "granted") {
          // For Android 11+, need additional MANAGE_EXTERNAL_STORAGE permission
          if (this.isAndroid11OrHigher()) {
            await this.requestManageStoragePermission();
          }
          return true;
        } else {
          console.error("Storage permission denied");
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  /**
   * Check if Android version is 11 or higher
   */
  private isAndroid11OrHigher(): boolean {
    if (Capacitor.getPlatform() === "android") {
      const androidVersion = parseInt((window as any).device?.version || "0");
      return androidVersion >= 11;
    }
    return false;
  }

  /**
   * Request MANAGE_EXTERNAL_STORAGE permission for Android 11+
   */
  private async requestManageStoragePermission(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).cordova && (window as any).cordova.plugins) {
        const permissions = (window as any).cordova.plugins.permissions;

        permissions.requestPermission(
          "android.permission.MANAGE_EXTERNAL_STORAGE",
          (status: any) => {
            if (status.hasPermission) {
              console.log("MANAGE_EXTERNAL_STORAGE granted");
              resolve();
            } else {
              // Open settings if permission denied
              this.openAppSettings();
              resolve();
            }
          },
          () => {
            console.error("Permission request failed");
            this.openAppSettings();
            resolve();
          },
        );
      } else {
        resolve();
      }
    });
  }

  /**
   * Open app settings for manual permission grant
   */
  async openAppSettings(): Promise<void> {
    if (Capacitor.getPlatform() === "android") {
      // await App.openUrl({ url: 'app-settings:' });
      console.warn("Open settings not implemented for this Capacitor version");
    }
  }

  /**
   * Access WhatsApp status files
   */
  async accessWhatsAppStatuses(): Promise<any[]> {
    try {
      // Check if running on native platform
      if (Capacitor.getPlatform() !== "android") {
        // Mock data for web testing if needed, or throw error
        console.warn(
          "This feature is only available on Android. Returning empty list.",
        );
        return [];
      }

      let path = this.whatsappStatusPath;

      // Try reading from default path
      try {
        await Filesystem.readdir({
          path: path,
          directory: Directory.External, // Use External storage
        });
      } catch (e) {
        // If default path fails, try legacy path
        console.log("Default path failed, trying legacy path");
        path = this.legacyWhatsappStatusPath;
      }

      // Read directory contents
      const result = await Filesystem.readdir({
        path: path,
        directory: Directory.External,
      });

      console.log("Status files found:", result.files);

      // Filter for image and video files
      const mediaFiles = result.files.filter(
        (file) =>
          file.name.endsWith(".jpg") ||
          file.name.endsWith(".jpeg") ||
          file.name.endsWith(".png") ||
          file.name.endsWith(".mp4"),
      );

      const statusFiles = [];
      for (const file of mediaFiles) {
        // Construct full path for reading later
        statusFiles.push({
          name: file.name,
          path: `${path}/${file.name}`,
          type: file.type,
          size: file.size,
          // For display, we might need to convert to a web-accessible URL
          // But Capacitor Filesystem usually requires reading the file content
          // Using Capacitor.convertFileSrc might help if we have the full path
          src: Capacitor.convertFileSrc(`${path}/${file.name}`),
        });
      }

      return statusFiles;
    } catch (error) {
      console.error("Error accessing WhatsApp statuses:", error);
      throw error;
    }
  }

  /**
   * Copy status file to accessible location
   */
  async copyStatusFile(fileName: string, sourcePath?: string): Promise<string> {
    try {
      // Use the path provided or partial path
      const fullPath = sourcePath || `${this.whatsappStatusPath}/${fileName}`;

      // Read the file from WhatsApp status folder
      const fileData = await Filesystem.readFile({
        path: fullPath,
        directory: Directory.External,
      });

      // Create destination folder if it doesn't exist
      await this.createDestinationFolder();

      // Write to destination folder
      const newFileName = `status_${Date.now()}_${fileName}`;
      await Filesystem.writeFile({
        path: `${this.destinationFolder}/${newFileName}`,
        data: fileData.data,
        directory: Directory.Documents,
      });

      console.log(`File copied successfully: ${newFileName}`);
      return newFileName;
    } catch (error) {
      console.error("Error copying file:", error);
      throw error;
    }
  }

  /**
   * Create destination folder for saved statuses
   */
  private async createDestinationFolder(): Promise<void> {
    try {
      await Filesystem.mkdir({
        path: this.destinationFolder,
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (error) {
      // Folder might already exist
      console.log("Folder creation info:", error);
    }
  }

  /**
   * Get all saved status files
   */
  async getSavedStatuses(): Promise<any[]> {
    try {
      const result = await Filesystem.readdir({
        path: this.destinationFolder,
        directory: Directory.Documents,
      });

      return result.files.map((file) => ({
        name: file.name,
        uri: file.uri,
      }));
    } catch (error) {
      console.error("Error getting saved statuses:", error);
      return [];
    }
  }
}
