import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';

export default function DrawerHomeScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-bold mb-4">Drawer Home Screen</Text>
      <Link href="/(drawer)/settings" asChild>
        <Button>
          <Text>Go to Settings</Text>
        </Button>
      </Link>
    </View>
  );
}
