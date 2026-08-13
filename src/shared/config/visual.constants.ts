export const AVAILABLE_THEMES = [
  { id: 'light', label: 'visual.constants.themes.light' },
  { id: 'dark', label: 'visual.constants.themes.dark' },
];

export const AVAILABLE_COLORS = [
  { id: '#ef4444', label: 'visual.constants.colors.red' },
  { id: '#f97316', label: 'visual.constants.colors.orange' },
  { id: '#eab308', label: 'visual.constants.colors.yellow' },
  { id: '#22c55e', label: 'visual.constants.colors.green' },
  { id: '#06b6d4', label: 'visual.constants.colors.cyan' },
  { id: '#3b82f6', label: 'visual.constants.colors.blue' },
  { id: '#8b5cf6', label: 'visual.constants.colors.purple' },
  { id: '#ec4899', label: 'visual.constants.colors.pink' },
  { id: '#18181b', label: 'visual.constants.colors.black' },
];

export const AVAILABLE_BORDER_RADII = [
  { id: '0px', label: 'visual.constants.borderRadii.square' },
  { id: '8px', label: 'visual.constants.borderRadii.soft' },
  { id: '16px', label: 'visual.constants.borderRadii.strong' },
  { id: '9999px', label: 'visual.constants.borderRadii.round' },
];

export const AVAILABLE_FONTS = [
  { id: 'font-sans', label: 'visual.constants.fonts.sans' },
  { id: 'font-serif', label: 'visual.constants.fonts.serif' },
  { id: 'font-mono', label: 'visual.constants.fonts.mono' },
];

export const AVAILABLE_BUTTON_STYLES = [
  { id: 'solid', label: 'visual.constants.buttonStyles.solid' },
  { id: 'outline', label: 'visual.constants.buttonStyles.outline' },
  { id: 'soft', label: 'visual.constants.buttonStyles.soft' },
];

export const AVAILABLE_SHADOWS = [
  { id: 'none', label: 'visual.constants.shadows.none' },
  { id: 'soft', label: 'visual.constants.shadows.soft' },
  { id: 'prominent', label: 'visual.constants.shadows.prominent' },
];

export const AVAILABLE_CARD_STYLES = [
  { id: 'standard', label: 'visual.constants.cardStyles.standard' },
  { id: 'flat', label: 'visual.constants.cardStyles.flat' },
  { id: 'outline', label: 'visual.constants.cardStyles.outline' },
];

export interface VisualSettings {
  theme: string;
  primaryColor: string;
  backgroundColor: string;
  borderRadius: string;
  fontFamily?: string;
  buttonStyle?: string;
  shadowIntensity?: string;
  cardStyle?: string;
}

export const DEFAULT_VISUAL_SETTINGS: VisualSettings = {
  theme: 'light',
  primaryColor: '#3b82f6', // Синій
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  fontFamily: 'font-sans',
  buttonStyle: 'solid',
  shadowIntensity: 'soft',
  cardStyle: 'standard',
};
