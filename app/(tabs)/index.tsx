import HabitCard from "@/components/HabitCard";
import HabitGreeting from "@/components/HabitGreeting";
import ProfileHeader from "@/components/ProfileHeader";
import Screen from "@/components/Screen";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

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
  const [nuevo, setNuevo] = useState();

  const nombre = "Juan Esteban";
  const edad = 26;
  const isPremium = true;
  const messages = 5;
  const fecha = new Date();
  const hora = fecha.getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const habits = [
    { id: "h1", title: "Beber agua", streak: 3, isCompleted: true },
    { id: "h2", title: "Leer 10 min", streak: 1, isCompleted: false },
    { id: "h3", title: "Caminar 15 min", streak: 7, isCompleted: false },
  ];

  return (
    <Screen>
      <ProfileHeader name="Juan Esteban" role="dev" />
      <HabitGreeting nombre="Ada" />
      <View style={{ gap: 12 }}>
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            title={h.title}
            streak={h.streak}
            isCompleted={h.isCompleted}
          />
        ))}
      </View>
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
});