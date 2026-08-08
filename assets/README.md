# Assets Directory

This directory contains all static assets used in the Disney Plus UI project.

## Image Files

### Logos and Branding

| File | Description | Usage |
|------|-------------|-------|
| `logo-blue.png` | Disney+ logo in blue | Login screen |
| `logo-white.png` | Disney+ logo in white | Main application header |
| `logo-imdb.png` | IMDb logo | Movie rating display |

### Icons and UI Elements

| File | Description | Usage |
|------|-------------|-------|
| `icon-play.png` | Play icon | "Watch Now" button |
| `icon-play-button.png` | Play button icon | Movie list items |
| `icons.png` | Collection of platform icons | Login screen footer |

### Background Images

| File | Description | Usage |
|------|-------------|-------|
| `login-background.png` | Login screen background | Login screen |
| `item-background.png` | Item card background | Movie/TV show cards |

### Preview Images

| File | Description | Usage |
|------|-------------|-------|
| `image.gif` | Animated preview | README and documentation |
| `image.webp` | WebP preview | README and documentation |

### Favicon

| File | Description | Usage |
|------|-------------|-------|
| `favicon.ico` | Website favicon | Browser tab icon |

## Dynamic Content

**Note:** Movie and TV show images are dynamically fetched from TMDB API and are not stored in this directory. The application uses the TMDB API to load:
- Backdrop images (featured movie background)
- Poster images (thumbnails in the movie list)
- All images are loaded in 4K UHD quality with automatic fallback

## Asset Quality Standards

All static assets in this directory should maintain:
- High visual quality
- Consistent branding with Disney+
- Optimized file sizes for web performance
- Appropriate transparency where needed (PNG format)

## Adding New Assets

When adding new assets to this directory:
1. Use appropriate file formats (PNG for transparency, JPG for photos, WebP for modern web)
2. Optimize file sizes while maintaining quality
3. Follow Disney+ branding guidelines
4. Update this README with the new asset information
5. Ensure accessibility by providing appropriate alt text in HTML

## File Naming Conventions

- Use lowercase with hyphens: `icon-play.png`
- Be descriptive: `logo-white.png` instead of `logo2.png`
- Include file extension: `.png`, `.jpg`, `.ico`, etc.

## Copyright

All Disney+ branding assets are subject to Disney's copyright and trademark guidelines. These assets are used for educational/demonstration purposes only.
