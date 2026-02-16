import { Component } from "@angular/core";
import { CommonModule } from "@angular/common"; // Import CommonModule for *ngIf, *ngFor
import { FileAccessService } from "./services/file-access.service";

@Component({
  selector: "app-root",
  standalone: true, // Make it standalone
  imports: [CommonModule], // Add CommonModule
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"], // Connect the new CSS file
})
export class AppComponent {
  permissionGranted: boolean = false;
  statusFiles: any[] = [];
  savedFiles: any[] = [];
  loading: boolean = false;
  errorMessage: string = "";

  constructor(private fileAccessService: FileAccessService) {}

  /**
   * Request permission and access files
   */
  async requestPermission() {
    this.loading = true;
    this.errorMessage = "";

    try {
      this.permissionGranted =
        await this.fileAccessService.requestStoragePermission();

      if (this.permissionGranted) {
        await this.loadWhatsAppStatuses();
      } else {
        this.errorMessage =
          "Permission denied. Please grant storage access in settings.";
      }
    } catch (error) {
      this.errorMessage = "Error requesting permission: " + error;
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load WhatsApp status files
   */
  async loadWhatsAppStatuses() {
    this.loading = true;
    this.errorMessage = "";

    try {
      this.statusFiles = await this.fileAccessService.accessWhatsAppStatuses();
      console.log("Loaded status files:", this.statusFiles);
    } catch (error) {
      this.errorMessage = "Error loading statuses: " + error;
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Save a specific status file
   */
  async saveStatus(fileName: string) {
    this.loading = true;
    this.errorMessage = "";

    try {
      const savedFileName =
        await this.fileAccessService.copyStatusFile(fileName);
      console.log("Status saved:", savedFileName);
      await this.loadSavedStatuses();
      alert(`Status saved successfully as ${savedFileName}`);
    } catch (error) {
      this.errorMessage = "Error saving status: " + error;
      console.error(error); // Keep this for debugging
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load all saved status files
   */
  async loadSavedStatuses() {
    try {
      this.savedFiles = await this.fileAccessService.getSavedStatuses();
    } catch (error) {
      console.error("Error loading saved statuses:", error);
    }
  }

  /**
   * Open app settings
   */
  async openSettings() {
    await this.fileAccessService.openAppSettings();
  }
}
