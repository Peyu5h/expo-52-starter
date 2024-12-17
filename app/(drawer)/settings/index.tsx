import { View, Text } from 'react-native';
import React from 'react';
import { Div } from '~/components/ui/div';

export default function SettingsScreen() {
  return (
    <Div className="bg-background text-foreground flex-1 justify-center items-center p-4">
      <Text className="text-2xl text-foreground font-bold">Miscilaneous</Text>
    </Div>
  );
}
