import { View, Vibration } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '~/components/ui/toast';

export default function TorchVibrationScreen() {
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const { toast } = useToast();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [activePattern, setActivePattern] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestPermission();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      const result = await requestCameraPermission();
      if (!result.granted) {
        toast({
          title: 'Permission Required',
          description: 'Camera access is needed for torch functionality',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request camera permission',
        variant: 'destructive',
      });
    }
  };

  const stopPattern = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTorchOn(false);
    setActivePattern(null);
  };

  const startPattern = (pattern: string, interval: number) => {
    stopPattern();

    setActivePattern(pattern);
    setTorchOn(true);

    intervalRef.current = setInterval(() => {
      setTorchOn((prev) => !prev);
    }, interval);

    toast({
      title: 'Pattern Started',
      description: `${pattern} pattern activated`,
    });
  };

  const handleVibrate = () => {
    Vibration.vibrate(2000);
  };

  const toggleTorch = async () => {
    try {
      if (!cameraPermission?.granted) {
        await requestPermission();
        return;
      }

      stopPattern();
      setTorchOn(!torchOn);

      toast({
        title: 'Success',
        description: torchOn ? 'Torch turned off' : 'Torch turned on',
      });
    } catch (err) {
      console.error('Failed to toggle torch:', err);
      toast({
        title: 'Error',
        description: 'Failed to toggle torch',
        variant: 'destructive',
      });
    }
  };

  if (!cameraPermission?.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Camera permission is required for torch functionality
        </Text>
        <Button variant="outline" onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4 gap-6">
      <CameraView ref={cameraRef} style={{ height: 1 }} facing="back" enableTorch={torchOn} />

      <View className="gap-4">
        <Button
          variant="outline"
          onPress={toggleTorch}
          className={`bg-primary ${activePattern ? 'opacity-50' : ''}`}
          disabled={!!activePattern}
        >
          <Text className="text-primary-foreground">
            {torchOn ? 'Turn Off Torch' : 'Turn On Torch'}
          </Text>
        </Button>

        <Button
          variant="outline"
          onPress={() => startPattern('Slow Blink', 2000)}
          className={activePattern === 'Slow Blink' ? 'bg-primary' : ''}
        >
          <Text>Blink (2s)</Text>
        </Button>

        {activePattern && (
          <Button variant="outline" onPress={stopPattern} className="bg-destructive">
            <Text className="text-destructive-foreground">Stop Pattern</Text>
          </Button>
        )}
      </View>

      <Button variant="outline" onPress={handleVibrate}>
        <Text>Vibrate</Text>
      </Button>
    </View>
  );
}
