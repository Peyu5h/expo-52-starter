import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';
import { Div } from '~/components/ui/div';

export default function HomeScreen() {
  return (
    <View className="flex-1 p-4 gap-4 bg-background">
      <Div className="text-4xl ">
        <Text>Hello</Text>
      </Div>
    </View>
  );
}
