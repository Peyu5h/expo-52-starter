import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function MaterialTopTabsLayout() {
  const { colors } = useTheme();
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: 'capitalize',
          fontWeight: 'bold',
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.text,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto', minWidth: 100 },
        lazy: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Permissions',
        }}
      />
      <MaterialTopTabs.Screen
        name="camMic"
        options={{
          title: 'Camera and mic',
        }}
      />
      <MaterialTopTabs.Screen
        name="location"
        options={{
          title: 'Location',
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
          title: 'Torch and vibration',
        }}
      />
      <MaterialTopTabs.Screen
        name="bluetoothWifi"
        options={{
          title: 'Bluetooth & wifi',
        }}
      />
    </MaterialTopTabs>
  );
}
