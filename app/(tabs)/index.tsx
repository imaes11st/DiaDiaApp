import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileHeader from "@/components/ProfileHeader";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Habit = {
  id: string;
  title: string;
  streak: number;
  isCompleted: boolean;
  priority: "low" | "mid" | "high";
};

const INITIAL: Habit[] = [
  {
    id: "h1",
    title: "Beber agua",
    streak: 3,
    isCompleted: true,
    priority: "mid",
  },
  {
    id: "h2",
    title: "Leer 10 min",
    streak: 1,
    isCompleted: false,
    priority: "low",
  },
  {
    id: "h3",
    title: "Caminar 15 min",
    streak: 7,
    isCompleted: false,
    priority: "high",
  },
];

export default function HomeScreen() {
  const [items, setItems] = useState<Habit[]>(INITIAL);
  const [nuevo, setNuevo] = useState("");
  const insets = useSafeAreaInsets();

  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const primary = useThemeColor({}, "primary");
  const onPrimary = useThemeColor({}, "onPrimary");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const toggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const completed = !h.isCompleted;
        return {
          ...h,
          isCompleted: completed,
          streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      })
    );
  }, []);

  const addHabit = useCallback(() => {
    const title = nuevo.trim();
    if (!title) return;
    setItems((prev) => [
      {
        id: `h${Date.now()}`,
        title,
        streak: 0,
        isCompleted: false,
        priority: "low",
      },
      ...prev,
    ]);
    setNuevo("");
  }, [nuevo]);

  const total = items.length;
  const completados = useMemo(
    () => items.filter((h) => h.isCompleted).length,
    [items]
  );

  const habits = [
    { id: "h1", title: "Beber agua", streak: 3, isCompleted: true },
    { id: "h2", title: "Leer 10 min", streak: 1, isCompleted: false },
    { id: "h3", title: "Caminar 15 min", streak: 7, isCompleted: false },
  ];

  const keyExtractor = useCallback((item: Habit) => item.id, []);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Habit>) => (
      <HabitCard
        title={item.title}
        streak={item.streak}
        isCompleted={item.isCompleted}
        priority={item.priority}
        onToggle={() => toggle(item.id)}
      />
    ),
   [toggle]
  );

  const itemSeparator = useCallback(() => <View style={{ height: 12 }} />, []);
  const Empty = () => (
    <ThemedText style={{ color: muted, textAlign: "center", marginTop: 32 }}>
      No hay habitos. Añade uno nuevo!
    </ThemedText>
  );

  return (
    <Screen>
      <ProfileHeader name="Juan Esteban" role="dev" />
      <HabitGreeting nombre="Ada" />
      <View style={[styles.row, { alignItems: "center" }]}>
        <TextInput
          value={nuevo}
          onChangeText={setNuevo}
          placeholder="Nuevo habito (ej Meditar)"
          onSubmitEditing={addHabit}
          style={[
            styles.input,
            { backgroundColor: surface, borderColor: border, color: text },
          ]}
        />
        <PrimaryButton title="Añadir" onPress={addHabit}></PrimaryButton>
      </View>
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
        ListEmptyComponent={Empty}
        contentContainerStyle={{ 
          paddingVertical: 16, 
          paddingBottom: insets.bottom + 16
         }}
         initialNumToRender={8}
         windowSize={10}
         showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F6FF",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#334155",
  },
  row: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});