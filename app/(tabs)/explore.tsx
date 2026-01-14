import { FlatList, StyleSheet, View } from 'react-native';

import QuickAddChips from '@/components/QuickAddChips';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';

export default function TabTwoScreen() {
    const [picked, setPicked] = useState<string[]>([]);
    const onPick = (t: string) => 
        setPicked((prev) => (prev.includes(t) ? prev : [...prev, t]));

  return (
    <Screen>
      <View>
        <ThemedText style={{ fontWeight: "700", fontSize: 18 }}>
          Sugerencias rapidas
        </ThemedText>
        <QuickAddChips onPick={onPick} />
        <ThemedText>Tus Selecciones</ThemedText>

        <FlatList 
        data={picked} 
        keyExtractor={(t) => t} 
        renderItem={({ item }) => <ThemedText>{item}</ThemedText>}
        ListEmptyComponent={<ThemedText>Toca un chip para añadir</ThemedText>}
        />  
              
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
