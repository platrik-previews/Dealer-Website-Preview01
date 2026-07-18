/**
 * COLOUR THEME CONFIGURATION
 * ------------------------------------------------------------
 * Quick method: change ACTIVE_THEME to another preset name.
 * Custom method: edit the values inside the "custom" preset.
 */
export const themePresets = {
  oceanBlue: {
    background: '#080b0d',
    backgroundRgb: '8, 11, 13',
    surface: '#111518',
    surfaceAlt: '#171c20',
    heroMid: '#0c1114',
    text: '#f4f7f8',
    muted: '#929da3',
    accent: '#58d7e6',
    accentRgb: '88, 215, 230',
    accentStrong: '#21b7ca',
    accentHover: '#8ce8f2',
    accentContrast: '#061014',
    footerText: '#061014',
    border: 'rgba(255, 255, 255, 0.10)',
    radius: '18px',
    pageWidth: 'min(92vw, 1380px)',
  },
  racingRed: {
    background: '#0b0909', backgroundRgb: '11, 9, 9', surface: '#171212', surfaceAlt: '#201818', heroMid: '#130d0d', text: '#fff7f6', muted: '#a99b99', accent: '#ff554d', accentRgb: '255, 85, 77', accentStrong: '#e43b34', accentHover: '#ff7b75', accentContrast: '#190302', footerText: '#190302', border: 'rgba(255, 255, 255, 0.10)', radius: '18px', pageWidth: 'min(92vw, 1380px)',
  },
  britishGreen: {
    background: '#07100d', backgroundRgb: '7, 16, 13', surface: '#0f1b17', surfaceAlt: '#17251f', heroMid: '#0a1712', text: '#f5faf7', muted: '#91a39b', accent: '#58d69a', accentRgb: '88, 214, 154', accentStrong: '#2cad75', accentHover: '#7ce6b3', accentContrast: '#03130b', footerText: '#03130b', border: 'rgba(255, 255, 255, 0.10)', radius: '18px', pageWidth: 'min(92vw, 1380px)',
  },
  champagne: {
    background: '#0d0c0a', backgroundRgb: '13, 12, 10', surface: '#191713', surfaceAlt: '#24211b', heroMid: '#14110d', text: '#fbf7ed', muted: '#a9a091', accent: '#e2bd75', accentRgb: '226, 189, 117', accentStrong: '#c99c4e', accentHover: '#edcf93', accentContrast: '#1b1204', footerText: '#1b1204', border: 'rgba(255, 255, 255, 0.10)', radius: '18px', pageWidth: 'min(92vw, 1380px)',
  },
  custom: {
    background: '#080b0d', backgroundRgb: '8, 11, 13', surface: '#111518', surfaceAlt: '#171c20', heroMid: '#0c1114', text: '#f4f7f8', muted: '#929da3', accent: '#58d7e6', accentRgb: '88, 215, 230', accentStrong: '#21b7ca', accentHover: '#8ce8f2', accentContrast: '#061014', footerText: '#061014', border: 'rgba(255, 255, 255, 0.10)', radius: '18px', pageWidth: 'min(92vw, 1380px)',
  },
};

export const ACTIVE_THEME = 'oceanBlue';
export const theme = themePresets[ACTIVE_THEME] || themePresets.oceanBlue;
