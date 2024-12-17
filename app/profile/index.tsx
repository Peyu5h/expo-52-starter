import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View className="flex-1 p-4 gap-4 bg-background">
      <Text className="text-xl font-bold mb-4">Expo Sensors</Text>

      <Link href="/profile/my-profile" asChild>
        <Button>
          <Text>View all sensors</Text>
        </Button>
      </Link>
    </View>
  );
}
