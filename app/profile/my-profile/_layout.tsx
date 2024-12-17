import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { getColor } from '~/lib/utils';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function MaterialTopTabsLayout() {
  const { colors } = useTheme();
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: getColor('foreground'),
        tabBarInactiveTintColor: getColor('muted-foreground'),
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: 'capitalize',
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: getColor('background'),
        },
        tabBarIndicatorStyle: {
          backgroundColor: getColor('foreground'),
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto', minWidth: 100 },
        lazy: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="camMic"
        options={{
          title: 'Camera',
        }}
      />
      <MaterialTopTabs.Screen
        name="location"
        options={{
          title: 'Map',
        }}
      />

      <MaterialTopTabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />

      <MaterialTopTabs.Screen
        name="torchVibration"
        options={{
          title: 'torchVibration',
        }}
      />
      <MaterialTopTabs.Screen
        name="shareBtn"
        options={{
          title: 'Share',
        }}
      />
      <MaterialTopTabs.Screen
        name="fileManager"
        options={{
          title: 'FileManager',
        }}
      />
    </MaterialTopTabs>
  );
}
