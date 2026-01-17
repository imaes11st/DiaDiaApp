import Badges from "@/components/Badges";
import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileHeader from "@/components/ProfileHeader";
import ProgressStats from "@/components/ProgressStats";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useCelebration } from "@/context/CelebrationProvider";
import { useHabits } from "@/context/HabitsContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
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

type HabitItem = ReturnType<typeof useHabits>["habits"][number];

export default function HomeScreen() {
  const { loading, habits, addHabit, toggleHabit } = useHabits();
  const [items, setItems] = useState<Habit[]>(INITIAL);
  const [nuevo, setNuevo] = useState("");
  const insets = useSafeAreaInsets();

  const  { celebrate } = useCelebration();

  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const onAdd = useCallback(() => {
    const title = nuevo.trim();
    if (!title) return;
    addHabit(title, "low");
    setNuevo("");
  }, [nuevo, addHabit]);

  const total = items.length;
  const completados = useMemo(() => {
    const today = new Date().toDateString();
    return habits.filter(
      (h) => h.lastDoneAt && new Date(h.lastDoneAt).toDateString() === today
    ).length;
  }, [habits]);

  const shareProgress = useCallback(async () => {
    const message = `He completado ${completados} hábitos hoy en DiaDiaApp! ¿Te animas a unirte?`;
    await Share.share({ message });
  }, [completados]);

  async function onToggleWhitCelebration(item: HabitItem) {
    const wasToday = item.lastDoneAt ?
    isSameDay(item.lastDoneAt, Date.now()) : false;
    toggleHabit(item.id);
    if (!wasToday) {
      const msg = `¡Has completado "${item.title}"! 🎉`;
      celebrate(msg);
    }
  }

  const keyExtractor = useCallback((item: Habit) => item.id, []);
  const renderItem = ({ item }: ListRenderItemInfo<HabitItem>) => {
      const isToday = item.lastDoneAt
        ? new Date(item.lastDoneAt).toDateString() === new Date().toDateString()
        : false;
      return (
        <HabitCard
          title={item.title}
          streak={item.streak}
          isCompleted={isToday}
          priority={item.priority}
          onToggle={() => onToggleWhitCelebration(item)}
        />
      );
    };

  const ItemSeparator = () => <View style={{ height: 12 }} />;

  const Empty = () => (
    <View style={{ paddingVertical: 32, alignItems: "center", gap: 8 }}>
      <ThemedText>Aún no tienes hábitos. Crea el primero 👇</ThemedText>
    </View>
  );

  if (loading) {
    return (
      <Screen>
        <ThemedText>Cargando tus hábitos…</ThemedText>
      </Screen>
    );
  }

  const isSameDay = (a: string | number | Date, b: string | number | Date) =>
    new Date(a).toDateString() === new Date(b).toDateString();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <ProfileHeader name="Juan Esteban" role="dev" />
        <HabitGreeting nombre="Ada" />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mis Hábitos</ThemedText>
          <FlatList
            data={habits}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={Empty}
            contentContainerStyle={{
              paddingVertical: 16,
              paddingBottom: insets.bottom + 16,
            }}
            initialNumToRender={8}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Progreso</ThemedText>
          <ProgressStats />
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Calendario Semanal</ThemedText>
          <WeeklyCalendar />
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Logros</ThemedText>
          <Badges />
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Añadir Nuevo Hábito</ThemedText>
          <View style={[styles.row, { alignItems: "center" }]}>
            <TextInput
              value={nuevo}
              onChangeText={setNuevo}
              placeholder="Nuevo habito (ej Meditar)"
              onSubmitEditing={onAdd}
              style={[
                styles.input,
                { backgroundColor: surface, borderColor: border, color: text },
              ]}
              placeholderTextColor={muted}
            />
            <PrimaryButton title="Añadir" onPress={onAdd}></PrimaryButton>
          </View>
          <View style={[styles.row, { alignItems: "center" }]}>
            <PrimaryButton title="Compartir Progreso" onPress={shareProgress}></PrimaryButton>
          </View>
        </View>
      </ScrollView>
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
  section: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0F172A",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
});