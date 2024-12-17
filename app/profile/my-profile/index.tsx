// npx expo install expo-sensors expo-bluetooth expo-camera expo-location expo-media-library expo-notifications expo-file-system

import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useToast } from '~/components/ui/toast';
import React, { useEffect } from 'react';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import * as Sensors from 'expo-sensors';
import { Audio } from 'expo-av';

export default function MyProfileScreen() {
  const { toast } = useToast();

  // Separate sensor availability state from permissions
  const [sensorAvailability, setSensorAvailability] = React.useState({
    accelerometer: false,
    gyroscope: false,
    magnetometer: false,
  });

  // Permission states (remove sensors from here)
  const [permissions, setPermissions] = React.useState({
    camera: false,
    microphone: false,
    location: false,
    mediaLibrary: false,
    notifications: false,
  });

  // Add separate check for sensors
  const checkSensorAvailability = async () => {
    try {
      const [accelerometer, gyroscope, magnetometer] = await Promise.all([
        Sensors.Accelerometer.isAvailableAsync(),
        Sensors.Gyroscope.isAvailableAsync(),
        Sensors.Magnetometer.isAvailableAsync(),
      ]);

      setSensorAvailability({
        accelerometer,
        gyroscope,
        magnetometer,
      });

      // Start sensors if available
      if (accelerometer) Sensors.Accelerometer.setUpdateInterval(1000);
      if (gyroscope) Sensors.Gyroscope.setUpdateInterval(1000);
      if (magnetometer) Sensors.Magnetometer.setUpdateInterval(1000);
    } catch (error) {
      console.error('Error checking sensor availability:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      // Camera and Microphone permissions
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      const microphoneStatus = await Camera.getMicrophonePermissionsAsync();

      // Location permissions
      const locationStatus = await Location.getForegroundPermissionsAsync();

      // Notification permissions
      const notificationStatus = await Notifications.getPermissionsAsync();

      // Media Library permissions
      const mediaStatus = await MediaLibrary.getPermissionsAsync();

      setPermissions({
        camera: cameraStatus.granted,
        microphone: microphoneStatus.granted,
        location: locationStatus.granted,
        mediaLibrary: mediaStatus.granted,
        notifications: notificationStatus.granted,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  // Check both permissions and sensor availability on mount
  useEffect(() => {
    checkPermissions();
    checkSensorAvailability();
  }, []);

  const handlePermissionToggle = async (type: keyof typeof permissions) => {
    try {
      let status;

      switch (type) {
        case 'camera':
          status = await Camera.requestCameraPermissionsAsync();
          break;
        case 'microphone':
          status = await Camera.requestMicrophonePermissionsAsync();
          break;
        case 'location':
          status = await Location.requestForegroundPermissionsAsync();
          break;
        case 'mediaLibrary':
          status = await MediaLibrary.requestPermissionsAsync();
          break;
        case 'notifications':
          status = await Notifications.requestPermissionsAsync();
          break;
      }

      await checkPermissions(); // Refresh all permissions

      toast({
        title: status?.granted ? 'Permission Granted' : 'Permission Denied',
        description: `${type} permission has been ${status?.granted ? 'granted' : 'denied'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to toggle ${type} permission`,
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <View className="w-full  space-y-4">
        {/* Camera Permission */}
        <View className="flex-row my-2 items-center justify-between">
          <Label nativeID="camera-permission">Camera Access</Label>
          <Switch
            checked={permissions.camera}
            onCheckedChange={() => handlePermissionToggle('camera')}
            nativeID="camera-permission"
          />
        </View>

        {/* Microphone Permission */}
        <View className="flex-row my-2 items-center justify-between">
          <Label nativeID="microphone-permission">Microphone Access</Label>
          <Switch
            checked={permissions.microphone}
            onCheckedChange={() => handlePermissionToggle('microphone')}
            nativeID="microphone-permission"
          />
        </View>

        {/* Location Permission */}
        <View className="flex-row my-2 items-center justify-between">
          <Label nativeID="location-permission">Location Access</Label>
          <Switch
            checked={permissions.location}
            onCheckedChange={() => handlePermissionToggle('location')}
            nativeID="location-permission"
          />
        </View>

        {/* Media Library Permission */}
        <View className="flex-row my-2 items-center justify-between">
          <Label nativeID="media-permission">Media Library Access</Label>
          <Switch
            checked={permissions.mediaLibrary}
            onCheckedChange={() => handlePermissionToggle('mediaLibrary')}
            nativeID="media-permission"
          />
        </View>

        {/* Notifications Permission */}
        <View className="flex-row my-2 items-center justify-between">
          <Label nativeID="notifications-permission">Notifications</Label>
          <Switch
            checked={permissions.notifications}
            onCheckedChange={() => handlePermissionToggle('notifications')}
            nativeID="notifications-permission"
          />
        </View>

        {/* Update Sensors section to show availability status */}
        <View className="pt-4">
          <Text className="text-lg font-bold mb-2">Sensor Availability</Text>

          <View className="flex-row my-2 items-center justify-between">
            <Label>Accelerometer</Label>
            <Text>{sensorAvailability.accelerometer ? 'Available' : 'Not Available'}</Text>
          </View>

          <View className="flex-row my-2 items-center justify-between">
            <Label>Gyroscope</Label>
            <Text>{sensorAvailability.gyroscope ? 'Available' : 'Not Available'}</Text>
          </View>

          <View className="flex-row my-2 items-center justify-between">
            <Label>Magnetometer</Label>
            <Text>{sensorAvailability.magnetometer ? 'Available' : 'Not Available'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
