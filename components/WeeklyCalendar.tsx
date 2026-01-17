import { ThemedText } from "@/components/themed-text";
import { useHabits } from "@/context/HabitsContext";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function WeeklyCalendar() {
  const { habits } = useHabits();

  const weekData = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    return DAYS.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateString = date.toDateString();

      const completedCount = habits.filter((habit) =>
        habit.lastDoneAt && new Date(habit.lastDoneAt).toDateString() === dateString
      ).length;

      const isToday = date.toDateString() === new Date().toDateString();

      return {
        day,
        date,
        completedCount,
        isToday,
      };
    });
  }, [habits]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Calendario Semanal</ThemedText>
      <View style={styles.daysRow}>
        {weekData.map((item) => (
          <View key={item.day} style={[styles.day, item.isToday && styles.today]}>
            <ThemedText style={styles.dayLabel}>{item.day}</ThemedText>
            <View style={[styles.circle, item.completedCount > 0 && styles.completed]}>
              <ThemedText style={styles.count}>{item.completedCount}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  day: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  completed: {
    backgroundColor: "#4caf50",
  },
  today: {
    borderWidth: 2,
    borderColor: "#2196f3",
    borderRadius: 8,
  },
  count: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});