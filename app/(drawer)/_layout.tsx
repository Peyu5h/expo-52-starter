import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerTintColor: isDarkColorScheme ? '#fff' : '#000',
        drawerActiveTintColor: isDarkColorScheme ? '#fff' : '#000',
        drawerInactiveTintColor: isDarkColorScheme ? '#888' : '#666',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Drawer Home',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Drawer>
  );
}
