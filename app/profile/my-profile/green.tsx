import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function GreenScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl">Green Tab Content</Text>
    </View>
  );
}
