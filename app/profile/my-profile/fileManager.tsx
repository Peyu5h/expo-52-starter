import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Platform, Share } from 'react-native';
import { Text } from '~/components/ui/text';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import { Checkbox } from '~/components/ui/checkbox';
import * as IntentLauncher from 'expo-intent-launcher';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '~/components/ui/button';
import { useToast } from '~/components/ui/toast';

interface FileItem {
  name: string;
  uri: string;
  type: string;
  size: number;
}

type FileFilter = 'all' | 'pdf' | 'txt' | 'apk' | 'other';

export default function FileManagerScreen() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<FileFilter[]>(['all']);
  const [directory, setDirectory] = useState<string | null>(null);
  const { toast } = useToast();

  const filterOptions: { label: string; value: FileFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Text', value: 'txt' },
    { label: 'APK', value: 'apk' },
    { label: 'Other', value: 'other' },
  ];

  const handleFilterChange = (filter: FileFilter) => {
    setActiveFilters((prev) => {
      if (filter === 'all') {
        return ['all'];
      }
      const newFilters = prev.filter((f) => f !== 'all');
      if (newFilters.includes(filter)) {
        return newFilters.filter((f) => f !== filter);
      }
      return [...newFilters, filter];
    });
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // Try to use downloads directory first as it's more commonly accessible
        const downloadPath = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        if (downloadPath) {
          setDirectory(downloadPath);
          await loadFiles(downloadPath);
        }
      }
    } catch (error) {
      console.error('Error accessing storage:', error);
    }
  };

  const selectDirectory = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await IntentLauncher.startActivityAsync(
          'android.intent.action.OPEN_DOCUMENT_TREE',
          {
            flags: 3,
          }
        );

        if (result.resultCode === IntentLauncher.ResultCode.Success && result.data) {
          const uri = result.data;
          console.log('Selected directory URI:', uri);
          setDirectory(uri);

          try {
            const persistedPermissions =
              await StorageAccessFramework.requestDirectoryPermissionsAsync(uri);

            if (persistedPermissions.granted) {
              const permittedUri = persistedPermissions.directoryUri;
              console.log('Permitted URI:', permittedUri);

              const files = await StorageAccessFramework.readDirectoryAsync(permittedUri);
              console.log('Files found:', files.length);

              const fileDetails = await Promise.all(
                files.map(async (fileUri) => {
                  try {
                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    const fileName = fileUri.split('/').pop() || 'unknown';

                    return {
                      name: fileName,
                      uri: fileUri,
                      type: fileName.split('.').pop()?.toLowerCase() || 'unknown',
                      size: (fileInfo as any).size || 0,
                    };
                  } catch (error) {
                    console.error('Error getting file info:', error);
                    return null;
                  }
                })
              );

              const validFiles = fileDetails.filter((file): file is FileItem => file !== null);
              console.log('Valid files found:', validFiles.length);
              setFiles(validFiles);
            }
          } catch (error) {
            console.error('Error accessing directory:', error);
          }
        }
      } else {
        // iOS fallback
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/*',
          copyToCacheDirectory: false,
          multiple: false,
        });

        if (!result.canceled) {
          const selectedUri = result.assets[0].uri;
          setDirectory(selectedUri);
          await loadFiles(selectedUri);
        }
      }
    } catch (error) {
      console.error('Error in selectDirectory:', error);
    }
  };

  const loadFiles = async (dirUri: string) => {
    try {
      if (Platform.OS === 'web') {
        console.log('File system operations not supported on web');
        return;
      }

      // Handle Android content URIs
      if (dirUri.startsWith('content://')) {
        try {
          const files = await StorageAccessFramework.readDirectoryAsync(dirUri);
          console.log('Reading SAF directory, found files:', files.length);

          const fileDetails = await Promise.all(
            files.map(async (fileUri) => {
              try {
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                const fileName = fileUri.split('/').pop() || 'unknown';
                return {
                  name: fileName,
                  uri: fileUri,
                  type: fileName.split('.').pop()?.toLowerCase() || 'unknown',
                  size: (fileInfo as any).size || 0,
                };
              } catch (error) {
                console.error('Error getting file info:', error);
                return null;
              }
            })
          );

          const validFiles = fileDetails.filter((file): file is FileItem => file !== null);
          console.log('Valid files processed:', validFiles.length);
          setFiles(validFiles);
          return;
        } catch (error) {
          console.error('Error reading SAF directory:', error);
        }
      }

      // Regular file system approach for non-content URIs
      const fileInfo = await FileSystem.getInfoAsync(dirUri);
      if (fileInfo.exists) {
        const contents = await FileSystem.readDirectoryAsync(dirUri);
        const fileDetails = await Promise.all(
          contents.map(async (name) => {
            try {
              const filePath = `${dirUri}${dirUri.endsWith('/') ? '' : '/'}${name}`;
              const info = await FileSystem.getInfoAsync(filePath);
              return {
                name,
                uri: info.uri,
                type: name.split('.').pop()?.toLowerCase() || 'unknown',
                size: (info as any).size || 0,
              };
            } catch (error) {
              console.error(`Error loading file ${name}:`, error);
              return null;
            }
          })
        );

        setFiles(fileDetails.filter((file): file is FileItem => file !== null));
      }
    } catch (error) {
      console.error('Error in loadFiles:', error);
    }
  };

  const filteredFiles = files.filter((file) => {
    if (activeFilters.includes('all')) return true;
    const fileType = file.type.toLowerCase();
    return activeFilters.some((filter) => {
      if (filter === 'other') {
        return !['pdf', 'txt', 'apk'].includes(fileType);
      }
      return fileType === filter;
    });
  });

  const handleShareFile = async () => {
    if (!selectedFile) return;

    try {
      await Share.share({
        title: `Share ${selectedFile.name}`,
        message: `Sharing file: ${selectedFile.name}`,
        url: Platform.OS === 'ios' ? selectedFile.uri.replace('file://', '') : selectedFile.uri,
      });

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
    <View className="flex-1 p-4">
      {/* Directory Selection and Current Path */}
      <View className="mb-4">
        <TouchableOpacity onPress={selectDirectory} className="bg-blue-500 p-4 rounded-lg mb-2">
          <Text className="text-white text-center">
            {directory ? 'Change Directory' : 'Select Directory'}
          </Text>
        </TouchableOpacity>
        {directory && (
          <View className="bg-gray-100 p-2 rounded">
            <Text className="text-sm" numberOfLines={1}>
              Current Path: {directory}
            </Text>
          </View>
        )}
      </View>

      {/* Filter Section */}
      <View className="flex-row flex-wrap gap-4 mb-4">
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            className="flex-row items-center"
            onPress={() => handleFilterChange(option.value)}
          >
            <Checkbox
              checked={activeFilters.includes(option.value)}
              onCheckedChange={() => handleFilterChange(option.value)}
            />
            <Text className="ml-2">{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* File List */}
      {files.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No files found in this directory</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {filteredFiles.map((file, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 border-b border-gray-200 ${
                selectedFile?.uri === file.uri ? 'bg-blue-100' : ''
              }`}
              onPress={() => setSelectedFile(file)}
            >
              <Text className="font-medium">{file.name}</Text>
              <Text className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB • {file.type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Selected File Info */}
      {selectedFile && (
        <View className="mt-4 p-4 bg-gray-100 rounded-lg">
          <Text className="font-bold">Selected File:</Text>
          <Text>Name: {selectedFile.name}</Text>
          <Text>Type: {selectedFile.type}</Text>
          <Text>Size: {(selectedFile.size / 1024).toFixed(2)} KB</Text>
          <Button
            onPress={handleShareFile}
            className="mt-2 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="share-outline" size={20} color="text-primary-foreground" />
            <Text className="text-primary-foreground">Share File</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
