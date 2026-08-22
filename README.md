# Archive

Archive is a modern, privacy-focused application designed to help you save, organize, and preserve your favorite social media statuses and stories locally on your device. Currently prioritizing WhatsApp statuses, the app ensures that your memories stay entirely on your device without ever being uploaded to external servers.

Built as a hybrid application, Archive works on the web and can be compiled into a native Android/iOS application using Capacitor.

## ✨ Features

- **Local-First Privacy**: All media processing and saving happen securely on your device. No data is sent to the cloud.
- **Smart WhatsApp Status Scanning**: Automatically detects WhatsApp status directories (including Business and Android 11+ scoped storage) using native file system APIs.
- **Web & Native Support**: Utilizes the modern File System Access API for web browsers and Capacitor Filesystem for native Android/iOS builds.
- **Media Library & Viewer**: Built-in gallery to view archived images and autoplay videos in high quality.
- **Native Sharing**: Share saved statuses directly to other apps using the native Share API.
- **Custom Storage Location**: Route your saved files directly to an SD Card or a custom `Archive` folder.
- **Dark & Light Themes**: Fully responsive UI with automated and manual dark mode toggles.
- **Modern UI/UX**: Built with Tailwind CSS, featuring glassmorphism, fluid animations, and mobile-first design.

## 🛠️ Tech Stack

- **Framework**: [Angular 21](https://angular.dev/) (Standalone Components, Signals)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Native Bridge**: [Capacitor 6](https://capacitorjs.com/) (Core, App, Filesystem)
- **Reactivity**: [RxJS](https://rxjs.dev/)
- **Storage**: IndexedDB (Web Handles), Capacitor Filesystem (Native)

## 📂 Project Structure

```text
├── android/                # Capacitor Android native project files
├── ios/                    # Capacitor iOS native project files
├── src/                    # Main application source code
│   ├── app.component.ts    # Root component & layout wrapper
│   ├── animations.ts       # Reusable Angular route/UI animations
│   ├── components/         # UI Components (Navbar, Downloader, Archive, Settings, etc.)
│   ├── services/           # Core business logic (StatusService, ToastService)
│   ├── main.ts             # Application bootstrap entry point
│   └── index.html          # Main HTML template
├── public/                 # Static assets (icons, etc.)
├── angular.json            # Angular workspace configuration
├── capacitor.config.ts     # Capacitor configuration
├── package.json            # NPM dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🚀 Setup and Installation

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Android Studio** / **Xcode** (If building for mobile via Capacitor)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd archive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:3000` (or `http://localhost:4200` depending on your Angular CLI settings).*

## 📱 Building for Mobile (Capacitor)

Archive is configured with Capacitor to easily wrap the web app into a native mobile application.

1. **Build the web project:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor native platforms:**
   ```bash
   npx cap sync
   ```
   *(Or use the custom script: `npm run build:mobile`)*

3. **Open the native IDE:**
   - **Android**: `npx cap open android`
   - **iOS**: `npx cap open ios`

4. **Run the app**: Use Android Studio or Xcode to build, run, and deploy the application to your physical device or emulator.

## 📖 Usage Guidelines

1. **Initial Access**: When you first open the app, it will request permission to access your local device storage or specific WhatsApp `.Statuses` folders.
2. **Granting Web Permission**: On the web version, a prompt will guide you to manually select the folder using the browser's Directory Picker. 
3. **Saving Statuses**: In the "Download" tab, browse recently viewed statuses. Click the "Save" icon to permanently move the status to your Library.
4. **Library Management**: Navigate to the "Library" tab to view, play, or share your saved memories.
5. **Changing Storage (SD Card)**: Go to Settings -> Storage to configure a custom save location, such as an external SD card.

## 📦 Key Dependencies

- `@angular/core`, `@angular/common`, `@angular/animations` - Core application framework.
- `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/filesystem` - Native device access.
- `tailwindcss` - Utility-first CSS styling.

## 📄 License

&copy; 2026 Archive. All rights reserved. Designed for local, secure personal archiving.
