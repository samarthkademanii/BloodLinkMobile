import {
  useFonts as useDMSerifDisplay,
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import {
  useFonts as useDMMono,
  DMMono_400Regular,
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Same pairing as the website: a serif display face for headings, Inter for
// body text, DM Mono for blood-type labels and numeric data.
export const fonts = {
  display: 'DMSerifDisplay_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
};

export function useAppFonts() {
  const [serifLoaded] = useDMSerifDisplay({ DMSerifDisplay_400Regular });
  const [monoLoaded] = useDMMono({ DMMono_400Regular, DMMono_500Medium });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  return serifLoaded && monoLoaded && interLoaded;
}
