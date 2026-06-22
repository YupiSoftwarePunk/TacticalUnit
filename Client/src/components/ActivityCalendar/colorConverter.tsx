class ColorMixer {
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.replace('#', '');
    
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number): string => {
      const clamped = Math.max(0, Math.min(255, Math.round(n)));
      return clamped.toString(16).padStart(2, '0');
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  mix(colors: string[]): string {
    if (!colors || colors.length === 0) {
      throw new Error('Массив цветов не должен быть пустым');
    }

    // Преобразуем все цвета в RGB
    const rgbColors = colors.map(color => this.hexToRgb(color));

    const totalR = rgbColors.reduce((sum, color) => sum + color.r, 0);
    const totalG = rgbColors.reduce((sum, color) => sum + color.g, 0);
    const totalB = rgbColors.reduce((sum, color) => sum + color.b, 0);

    const count = rgbColors.length;
    const avgR = totalR / count;
    const avgG = totalG / count;
    const avgB = totalB / count;

    return this.rgbToHex(avgR, avgG, avgB);
  }
}

const colorMixer = new ColorMixer();

function mixColors(colors: string[]): string | undefined {
    if (colors == undefined || colors.length == 0){return undefined}
    return colorMixer.mix(colors);
}

export { ColorMixer, mixColors };