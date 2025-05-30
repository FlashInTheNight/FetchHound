<p align="center">
  <img src="public/icon/128.png" alt="FetchHound Logo" width="96" height="96">
</p>

# FetchHound – Video & Image Downloader

A powerful browser extension that helps you easily download media content from web pages.

## Features

- **Smart Media Detection**: Automatically scans web pages for downloadable media files (images and videos)
- **Selective Downloading**: Choose which media files you want to download
- **Exclusion List**: Add files to an exclusion list to prevent them from appearing in future scans
- **Download Status Tracking**: Monitor download progress and receive detailed information about any failed downloads
- **User-Friendly Interface**: Simple and intuitive interface for managing your downloads

## Installation & Development

### Prerequisites
- Node.js (LTS version recommended)
- pnpm v9.12.3 or higher

### Setup
1. Clone the repository:
```bash
git clone https://github.com/FlashInTheNight/fetchhound.git
cd fetchhound
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

4. Load the extension in your browser:
   - **Firefox**: 
     1. Open `about:debugging`
     2. Click "This Firefox"
     3. Click "Load Temporary Add-on"
     4. Navigate to the project directory and select `dist/manifest.json`
   - **Chrome/Edge**:
     1. Open `chrome://extensions`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select the `dist` directory

### Building for Production
```bash
pnpm build
```
The built extension will be available in the `dist` directory.

## Important Notice

This extension is designed to work with standard media files that are directly accessible on web pages. It will not work with:
- YouTube videos
- Other streaming platforms that implement download restrictions
- Websites that use special protection mechanisms to prevent media downloading
- Content that requires authentication or special access rights

## Usage

1. Navigate to any webpage containing media files
2. Click the FetchHound extension icon
3. The extension will scan the page for available media
4. Select the files you want to download
5. Monitor download progress in the extension interface

## Privacy & Security

FetchHound only processes media files that are publicly accessible on the web pages you visit. It does not:
- Collect any personal data
- Track your browsing history
- Modify web page content
- Interfere with website functionality

## Support

If you encounter any issues or have suggestions for improvements, please visit our GitHub repository to submit an issue or feature request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.