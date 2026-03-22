export const PAKISTAN_CENTER: [number, number] = [30.3753, 69.3451];

export const PAKISTAN_BOUNDS: [[number, number], [number, number]] = [
  [23.5, 60.5], // SW corner
  [37.5, 77.5], // NE corner
];

export const DEFAULT_ZOOM = 6;
export const MIN_ZOOM = 5;
export const MAX_ZOOM = 18;

export const TILE_URLS = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';
