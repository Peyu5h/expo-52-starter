import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { getColor } from '~/lib/utils';
import { View } from 'react-native';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function DrawerLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerTintColor: getColor('foreground'),
        headerStyle: {
          backgroundColor: getColor('background'),
        },
        drawerActiveTintColor: getColor('foreground'),
        drawerInactiveTintColor: getColor('muted-foreground'),
        drawerStyle: {
          backgroundColor: getColor('background'),
          borderRightWidth: 0.5,
          borderRightColor: getColor('border'),
        },
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Form',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings/index"
        options={{
          title: 'Miscilaneous',
          drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Drawer>
  );
}
