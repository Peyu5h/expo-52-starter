import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4 gap-4">
      <Text className="text-xl font-bold mb-4">Profile Screen</Text>
      <Link href="/profile/my-profile" asChild>
        <Button>
          <Text>View My Profile</Text>
        </Button>
      </Link>
    </View>
  );
}
