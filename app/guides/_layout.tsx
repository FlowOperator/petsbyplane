import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

/**
 * Travel Guides layout — simple stack navigation for content screens.
 */
export default function GuidesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
