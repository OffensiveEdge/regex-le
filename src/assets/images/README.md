# Extension Assets

This directory contains visual assets for the extension.

## Required Images

### icon.png

- **Size**: 128x128 pixels (or 256x256 for Retina)
- **Format**: PNG with transparency
- **Purpose**: Extension icon shown in VS Code marketplace and sidebar
- **Guidelines**:
  - Simple, recognizable design
  - Works well at small sizes
  - Follows VS Code icon style
  - High contrast for visibility

### demo.gif (optional)

- **Purpose**: Animated demonstration of extension functionality
- **Guidelines**:
  - Keep under 5MB for fast loading
  - Show key features in action
  - 10-15 seconds duration
  - Clear, readable text/UI elements

### command-palette.png (optional)

- **Purpose**: Screenshot showing command palette integration
- **Guidelines**:
  - Show extension commands in palette
  - Clear, high-resolution screenshot
  - Highlight key commands

## Creating Icons

### Tools

- [Figma](https://www.figma.com/) - Free design tool
- [GIMP](https://www.gimp.org/) - Free image editor
- [Inkscape](https://inkscape.org/) - Free vector editor

### VS Code Icon Guidelines

- Use Material Design or similar icon style
- Prefer line icons over filled
- Use extension's brand colors
- Test visibility in light/dark themes

## Recording Demos

### Tools

- [LICEcap](https://www.cockos.com/licecap/) - Simple GIF recorder
- [Kap](https://getkap.co/) - macOS screen recorder
- [ScreenToGif](https://www.screentogif.com/) - Windows recorder

### Tips

- Use default VS Code theme for clarity
- Slow down cursor movements
- Show keyboard shortcuts
- Keep file size reasonable (<5MB)

## Placeholder Images

Until you create actual images, the extension will use:

- Default VS Code icon
- No demo GIF (optional anyway)
- No command palette screenshot (optional)

The extension will still work perfectly without custom images, but adding them improves the marketplace presentation.
