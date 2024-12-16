import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4 gap-4">
      <Text className="text-xl font-bold mb-4">Home Screen</Text>
      <Link href="/profile" asChild>
        <Button>
          <Text>View My Profile</Text>
        </Button>
      </Link>
      <Toast />
    </View>
  );
}
