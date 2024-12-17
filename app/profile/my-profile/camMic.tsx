import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { useToast } from '~/components/ui/toast';
import { cn } from '~/lib/utils';

export default function CamMicScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = Audio.usePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mode, setMode] = useState<'photo' | 'video' | 'audio'>('photo');
  const cameraRef = useRef<any>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingDuration(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestPermissions = async () => {
    try {
      const [cameraResult, audioResult, mediaResult] = await Promise.all([
        requestCameraPermission(),
        requestAudioPermission(),
        requestMediaPermission(),
      ]);

      if (!cameraResult?.granted || !audioResult?.granted || !mediaResult?.granted) {
        toast({
          title: 'Permission Required',
          description: 'Camera, Audio, Media Library access are needed for this feature',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request permissions',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        if (asset) {
          toast({
            title: 'Success',
            description: 'Photo saved to gallery',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to take photo',
        variant: 'destructive',
      });
    }
  };

  const startVideoRecording = async () => {
    if (!cameraRef.current) {
      toast({
        title: 'Error',
        description: 'Camera not ready',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Set video options
      const videoOptions = {
        maxDuration: 60,
        quality: '720p',
        mute: false,
        videoBitrate: 5000000,
      };

      setIsRecording(true);
      const videoRecording = await cameraRef.current.recordAsync(videoOptions);

      if (videoRecording?.uri) {
        const asset = await MediaLibrary.createAssetAsync(videoRecording.uri);
        if (asset) {
          toast({
            title: 'Success',
            description: 'Video saved to gallery',
          });
        }
      }
    } catch (error) {
      console.error('Video recording error:', error);
      toast({
        title: 'Error',
        description: 'Failed to record video. Please try again.',
        variant: 'destructive',
      });
      setIsRecording(false);
    }
  };

  const stopVideoRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
    } catch (error) {
      console.error('Stop recording error:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop recording',
        variant: 'destructive',
      });
    }
  };

  const startAudioRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: audioRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(audioRecording);
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start audio recording',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = async () => {
    try {
      if (mode === 'video') {
        await cameraRef.current?.stopRecording();
      } else if (mode === 'audio' && recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          const asset = await MediaLibrary.createAssetAsync(uri);
          if (asset) {
            toast({
              title: 'Success',
              description: 'Audio saved to gallery',
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save ${mode} recording`,
        variant: 'destructive',
      });
    } finally {
      setIsRecording(false);
      setRecording(null);
    }
  };

  const handleRecordPress = async () => {
    if (mode === 'photo') {
      await takePicture();
      return;
    }

    if (mode === 'audio') {
      if (isRecording) {
        await stopRecording();
      } else {
        await startAudioRecording();
      }
      return;
    }

    // Video mode
    if (isRecording) {
      await stopVideoRecording();
    } else {
      await startVideoRecording();
    }
  };

  if (!cameraPermission || !audioPermission || !mediaPermission) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">Requesting permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !audioPermission.granted || !mediaPermission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Camera, audio, and media library permissions are required
        </Text>
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg" onPress={requestPermissions}>
          <Text className="text-primary-foreground">Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {mode !== 'audio' ? (
        <View className="flex-1">
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            mode={mode === 'video' ? 'video' : 'picture'}
            // enableAudio={true}
          />
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl mb-4">Audio Recording Mode</Text>
          {isRecording && (
            <Text className="text-red-500">Recording... {formatDuration(recordingDuration)}</Text>
          )}
        </View>
      )}

      {isRecording && mode !== 'audio' && (
        <View className="absolute top-10 w-full items-center">
          <Text className="text-red-500 text-xl font-bold">
            ● {formatDuration(recordingDuration)}
          </Text>
        </View>
      )}

      <View className="absolute bottom-0 w-full pb-10 px-4">
        <View className="flex-row justify-around items-center mb-4">
          {['photo', 'video', 'audio'].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => !isRecording && setMode(m as typeof mode)}
              className={cn(
                'px-4 py-2 rounded-full',
                mode === m ? 'bg-primary' : 'bg-muted',
                isRecording && 'opacity-50'
              )}
              disabled={isRecording}
            >
              <Text className={mode === m ? 'text-primary-foreground' : 'text-foreground'}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-around items-center">
          {mode !== 'audio' && !isRecording && (
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleRecordPress}
            className={cn(
              'w-16 h-16 rounded-full border-4 justify-center items-center',
              isRecording ? 'border-red-500 bg-red-500' : 'border-white bg-transparent'
            )}
          >
            {isRecording ? (
              <View className="w-8 h-8 rounded-sm bg-white" />
            ) : (
              <View
                className={cn(
                  'w-12 h-12 rounded-full',
                  mode === 'photo' ? 'bg-white' : 'bg-red-500'
                )}
              />
            )}
          </TouchableOpacity>

          <View className="w-8 h-8">
            {mode === 'video' && isRecording && (
              <View className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
