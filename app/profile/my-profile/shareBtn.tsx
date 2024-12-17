import { View, Linking, Share, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { useToast } from '~/components/ui/toast';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default function ShareBtnScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleCall = async () => {
    try {
      // Remove any non-numeric characters from the phone number
      const cleanNumber = phoneNumber.replace(/[^\d]/g, '');

      if (cleanNumber.length < 10) {
        toast({
          title: 'Invalid Number',
          description: 'Please enter a valid phone number',
          variant: 'destructive',
        });
        return;
      }

      // Use tel: for iOS and telprompt: for Android
      const scheme = Platform.select({ ios: 'telprompt:', android: 'tel:' });
      const url = `${scheme}${cleanNumber}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        toast({
          title: 'Error',
          description: 'Phone call not supported',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to make call',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (type: 'image' | 'pdf' | 'text') => {
    try {
      if (type === 'image') {
        // Fetch image from URL
        const imageUrl =
          'https://res.cloudinary.com/dkysrpdi6/image/upload/v1710317497/ijkte1lttxyzroiop3dq.jpg';
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Convert blob to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Save to cache directory
        const fileName = 'shared_image.jpg';
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Share.share({
          title: 'Share Image',
          message: 'Check out this image!',
          url: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        });
      } else {
        // Handle PDF and Text files
        const result = await DocumentPicker.getDocumentAsync({
          type: type === 'pdf' ? 'application/pdf' : 'text/*',
          copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          throw new Error('No file selected');
        }

        const selectedFile = result.assets[0];

        // Read the file content
        const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save to cache with proper extension
        const fileExt = selectedFile.name.split('.').pop();
        const fileUri = `${FileSystem.cacheDirectory}shared_file.${fileExt}`;

        await FileSystem.writeAsStringAsync(fileUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Share.share({
          title: `Share ${type.toUpperCase()} File`,
          message: `Sharing ${type.toUpperCase()} file: ${selectedFile.name}`,
          url: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        });
      }

      toast({
        title: 'Success',
        description: 'File shared successfully',
      });
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to share file',
        variant: 'destructive',
      });
    }
  };

  return (
    <View className="flex-1 p-4 gap-8">
      <View className="gap-4">
        <Text className="text-xl font-bold">Make a Call</Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 h-12 px-4 border border-border rounded-lg"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity
            onPress={handleCall}
            className="h-12 w-12 bg-primary rounded-lg items-center justify-center"
          >
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="gap-4">
        <Text className="text-xl font-bold">Share Files</Text>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            onPress={() => handleShare('image')}
            className="flex-1 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="image" size={24} />
            <Text>Image</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => handleShare('pdf')}
            className="flex-1 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="document" size={24} />
            <Text>PDF</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => handleShare('text')}
            className="flex-1 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="text" size={24} />
            <Text>Text</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
