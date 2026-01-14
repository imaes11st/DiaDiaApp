import { StyleSheet, View } from "react-native";

import QuickAddChips from "@/components/QuickAddChips";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useHabits } from "@/context/HabitsContext";

export default function TabTwoScreen() {
  const { addHabit } = useHabits();
  const onPick = (t: string) => addHabit(t, "low");

  return (
    <Screen>
      <View>
        <ThemedText style={{ fontWeight: "700", fontSize: 18 }}>
          Sugerencias rápidas
        </ThemedText>
        <ThemedText>
          Desliza los chips y toca para crear el hábito al instante.
        </ThemedText>

        <QuickAddChips onPick={onPick} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});