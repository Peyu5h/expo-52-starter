import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Miscilaneous',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings/index"
        options={{
          title: 'Settings Page',
          drawerIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Drawer>
  );
}
