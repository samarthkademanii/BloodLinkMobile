import { useThemeOverride } from './ThemeContext';

const light = {
  bg: '#FAF7F8',
  fg: '#180C0F',
  fgMuted: '#7C6168',
  accent: '#C01429',
  accentDim: '#9B1020',
  accentSoft: '#FAECEE',
  surface: '#FFFFFF',
  surface2: '#F4ECED',
  border: '#E4D4D7',
  success: '#187A44',
  successSoft: '#EAF7F0',
  warning: '#B97008',
  warningSoft: '#FEF4E2',
  danger: '#C01429',
  dangerSoft: '#FDECEE',
};

const dark = {
  bg: '#0F0709',
  fg: '#F2E6E9',
  fgMuted: '#9C8288',
  accent: '#E62D42',
  accentDim: '#BF2337',
  accentSoft: '#280E13',
  surface: '#1A0D10',
  surface2: '#241318',
  border: '#3A2028',
  success: '#22A85A',
  successSoft: '#0B2018',
  warning: '#E0900F',
  warningSoft: '#201508',
  danger: '#E62D42',
  dangerSoft: '#200A0D',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  const { resolvedScheme } = useThemeOverride();
  return resolvedScheme === 'dark' ? dark : light;
}
