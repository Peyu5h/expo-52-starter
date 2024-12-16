import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';
import { useToast } from '~/components/ui/toast';

export default function MyProfileScreen() {
  const { toast } = useToast();

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-bold mb-4">My Profile Details</Text>
      <View className="w-full max-w-sm gap-4">
        <View className="bg-card p-4 rounded-lg">
          <Text className="text-muted-foreground">Name:</Text>
          <Text className="text-lg">John Doe</Text>
        </View>
        <View className="bg-card p-4 rounded-lg">
          <Text className="text-muted-foreground">Email:</Text>
          <Text className="text-lg">john@example.com</Text>
        </View>
        <Button
          className="mt-4"
          onPress={() => {
            toast({
              title: 'Profile Updated',
              description: 'Your profile has been updated successfully',
            });
          }}
        >
          <Text className="text-primary-foreground">Update Profile</Text>
        </Button>
      </View>
    </View>
  );
}
