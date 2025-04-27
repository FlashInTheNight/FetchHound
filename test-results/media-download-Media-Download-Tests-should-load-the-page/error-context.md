# Test info

- Name: Media Download Tests >> should load the page
- Location: C:\Users\Gigas\Desktop\kekus3000\e2e_tests\media-download.test.ts:11:5

# Error details

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/media-sites", waiting until "load"

    at C:\Users\Gigas\Desktop\kekus3000\e2e_tests\media-download.test.ts:12:20
```

# Page snapshot

```yaml
- heading "Доступные медиа-файлы" [level=2]
- img "Test Image 1"
- heading "Защищенные медиа-файлы" [level=2]
- img "Protected Image"
- heading "Медиа-файлы с ошибками" [level=2]
- img "Nonexistent Image"
- heading "Смешанный контент" [level=2]
- img "Test Image 2"
- link "PDF Document":
  - /url: media/document.pdf
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import path from 'path';
   3 |
   4 | test.describe('Media Download Tests', () => {
   5 |     test.beforeEach(async ({ page }) => {
   6 |         await page.goto('http://localhost:3000/media-sites');
   7 |         // Даем время для загрузки страницы
   8 |         await page.waitForLoadState('domcontentloaded');
   9 |     });
  10 |
  11 |     test('should load the page', async ({ page }) => {
> 12 |         await page.goto('http://localhost:3000/media-sites');
     |                    ^ Error: page.goto: Test timeout of 30000ms exceeded.
  13 |         
  14 |         // Проверяем, что страница загрузилась
  15 |         const title = await page.title();
  16 |         expect(title).toBe('Media Test Page');
  17 |         
  18 |         // Проверяем наличие основных элементов
  19 |         await expect(page.locator('body')).toBeVisible();
  20 |     });
  21 |
  22 |     test('should detect downloadable media files', async ({ page }) => {
  23 |         // Проверяем наличие доступных медиа-файлов
  24 |         const downloadableMedia = await page.locator('.downloadable-media');
  25 |         await expect(downloadableMedia).toBeVisible();
  26 |         
  27 |         // Проверяем наличие видео и изображений
  28 |         const videos = await downloadableMedia.locator('video').count();
  29 |         const images = await downloadableMedia.locator('img').count();
  30 |         
  31 |         expect(videos).toBeGreaterThan(0);
  32 |         expect(images).toBeGreaterThan(0);
  33 |
  34 |         // Проверяем, что файлы доступны для скачивания
  35 |         const videoSrc = await downloadableMedia.locator('video source').getAttribute('src');
  36 |         const imgSrc = await downloadableMedia.locator('img').getAttribute('src');
  37 |         
  38 |         expect(videoSrc).toBeTruthy();
  39 |         expect(imgSrc).toBeTruthy();
  40 |     });
  41 |
  42 |     test('should handle protected media files', async ({ page }) => {
  43 |         const protectedMedia = await page.locator('.protected-media');
  44 |         await expect(protectedMedia).toBeVisible();
  45 |         
  46 |         // Проверяем, что защищенные файлы не доступны для скачивания
  47 |         const protectedVideos = await protectedMedia.locator('video source').getAttribute('src');
  48 |         const protectedImages = await protectedMedia.locator('img').getAttribute('src');
  49 |         
  50 |         expect(protectedVideos).toContain('protected-video.com');
  51 |         expect(protectedImages).toContain('protected-image.com');
  52 |     });
  53 |
  54 |     test('should handle error cases', async ({ page }) => {
  55 |         const errorMedia = await page.locator('.error-media');
  56 |         await expect(errorMedia).toBeVisible();
  57 |         
  58 |         // Проверяем наличие элементов с ошибками
  59 |         const errorVideoSrc = await errorMedia.locator('video source').getAttribute('src');
  60 |         const errorImgSrc = await errorMedia.locator('img').getAttribute('src');
  61 |         
  62 |         expect(errorVideoSrc).toContain('nonexistent-video.mp4');
  63 |         expect(errorImgSrc).toContain('nonexistent-image.jpg');
  64 |     });
  65 |
  66 |     test('should handle mixed content', async ({ page }) => {
  67 |         const mixedContent = await page.locator('.mixed-content');
  68 |         await expect(mixedContent).toBeVisible();
  69 |         
  70 |         // Проверяем наличие разных типов контента
  71 |         const videoSrc = await mixedContent.locator('video source').getAttribute('src');
  72 |         const imgSrc = await mixedContent.locator('img').getAttribute('src');
  73 |         const pdfLink = await mixedContent.locator('a').getAttribute('href');
  74 |         
  75 |         expect(videoSrc).toContain('video_2.mp4');
  76 |         expect(imgSrc).toContain('pic_2.jpg');
  77 |         expect(pdfLink).toContain('.pdf');
  78 |     });
  79 | }); 
```