import '~/global.css';
import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { ThemeToggle } from '~/components/ThemeToggle';
import { View, Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { PortalHost } from '@rn-primitives/portal';
import { ToastProvider } from '~/components/ui/toast';

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1">
      <ToastProvider>
        <Tabs
          screenOptions={{
            headerRight: () => <ThemeToggle />,
            tabBarActiveTintColor: isDarkColorScheme ? '#fff' : '#000',
            tabBarInactiveTintColor: isDarkColorScheme ? '#888' : '#666',
            tabBarStyle: {
              elevation: 0,
              borderTopWidth: 0,
              position: 'relative',
              backgroundColor: isDarkColorScheme ? '#1e1e1e' : '#fefefe',
            },
            tabBarItemStyle: {
              paddingVertical: 5,
            },
            tabBarIconStyle: {
              marginBottom: -3,
            },
            tabBarButton: (props) => {
              const { children, onPress } = props;
              return (
                <Pressable onPress={onPress} className="flex-1">
                  {({ pressed }) => (
                    <View
                      className={cn(
                        'flex-1 items-center justify-center',
                        pressed && 'bg-primary/10'
                      )}
                    >
                      {children}
                    </View>
                  )}
                </Pressable>
              );
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ focused, color }) => (
                <View style={{ alignItems: 'center' }}>
                  <View
                    className="h-0.5 w-24 absolute -top-2 rounded-full bg-secondary-foreground"
                    style={{
                      opacity: focused ? 1 : 0,
                      transform: [{ scaleX: focused ? 1 : 0 }],
                    }}
                  />
                  <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                </View>
              ),
              tabBarLabel: ({ focused, color }) => (
                <Text className={`text-xs ${focused ? 'font-bold' : ''}`} style={{ color }}>
                  Home
                </Text>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(drawer)"
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <View
                  className={`p-1 rounded-full ${focused ? 'bg-primary/50' : ''}`}
                  style={{
                    transform: [{ scale: focused ? 1.1 : 1 }],
                    opacity: focused ? 1 : 1,
                  }}
                >
                  <Ionicons name={focused ? 'menu' : 'menu-outline'} size={24} color={color} />
                </View>
              ),
              title: 'Menu',
            }}
          />
        </Tabs>
        <PortalHost />
      </ToastProvider>
    </View>
  );
}
