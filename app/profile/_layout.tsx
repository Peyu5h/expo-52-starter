import { Stack } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';

export default function ProfileLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: isDarkColorScheme ? '#fff' : '#000',
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
