import { Stack } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { getColor } from '~/lib/utils';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: getColor('foreground'),
        animation: 'slide_from_right',
        animationDuration: 200,
        gestureDirection: 'horizontal',
        gestureEnabled: true,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="my-profile"
        options={{
          title: 'My Profile',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="my-profile/edit"
        options={{
          title: 'Edit Profile',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
