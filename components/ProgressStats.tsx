import { ThemedText } from "@/components/themed-text";
import { useHabits } from "@/context/HabitsContext";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function ProgressStats() {
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState<'general' | 'weekly'>('general');

  const stats = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    let weeklyCompleted = 0;
    let totalStreak = 0;

    habits.forEach((habit) => {
      totalStreak += habit.streak;

      // Count completions in the last 7 days
      if (habit.lastDoneAt) {
        const lastDone = new Date(habit.lastDoneAt);
        if (lastDone >= weekAgo) {
          weeklyCompleted += 1;
        }
      }
    });

    return {
      weeklyCompleted,
      totalHabits: habits.length,
      averageStreak: habits.length > 0 ? Math.round(totalStreak / habits.length) : 0,
    };
  }, [habits]);

  const chartData = useMemo(() => {
    console.log('Habits:', habits);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const data = days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index)); // Últimos 7 días
      const dateString = date.toDateString();
      console.log(`Day ${day}: ${dateString}`);
      const completedHabits = habits.filter(h => {
        if (!h.lastDoneAt) return false;
        const habitDate = new Date(h.lastDoneAt).toDateString();
        console.log(`Habit ${h.title} lastDoneAt: ${habitDate}`);
        return habitDate === dateString;
      });
      return {
        day,
        count: completedHabits.length,
        habits: completedHabits.map(h => h.title),
      };
    });
    console.log('Chart data:', data);
    return data;
  }, [habits]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Tu Progreso</ThemedText>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'general' && styles.activeTab]}
          onPress={() => setActiveTab('general')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>General</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>Semanales</ThemedText>
        </Pressable>
      </View>
      {activeTab === 'general' ? (
        <View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.number}>{stats.weeklyCompleted}</ThemedText>
              <ThemedText style={styles.label}>Completados esta semana</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.number}>{stats.totalHabits}</ThemedText>
              <ThemedText style={styles.label}>Hábitos totales</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.number}>{stats.averageStreak}</ThemedText>
              <ThemedText style={styles.label}>Racha promedio</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.subtitle}>Hábitos completados por día</ThemedText>
          <View style={styles.chartContainer}>
            {chartData.map((item) => {
              const maxCount = Math.max(...chartData.map(d => d.count));
              const height = maxCount > 0 ? (item.count / maxCount) * 120 : 0;
              return (
                <View key={item.day} style={styles.barContainer}>
                  <View style={[styles.bar, { height }]} />
                  <ThemedText style={styles.barLabel}>{item.count}</ThemedText>
                  <ThemedText style={styles.dayLabel}>{item.day}</ThemedText>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View>
          <ThemedText style={styles.subtitle}>Detalles de completados esta semana</ThemedText>
          {chartData.map((item) => (
            <View key={item.day} style={styles.dayDetail}>
              <ThemedText style={styles.dayTitle}>{item.day}: {item.count} completados</ThemedText>
              {item.habits.length > 0 ? (
                <View style={styles.habitsList}>
                  {item.habits.map((habit, idx) => (
                    <ThemedText key={idx} style={styles.habitItem}>• {habit}</ThemedText>
                  ))}
                </View>
              ) : (
                <ThemedText style={styles.noHabits}>Ningún hábito completado</ThemedText>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4caf50",
  },
  label: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 160,
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: 30,
    backgroundColor: "#4caf50",
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4caf50",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
  },
  habitsList: {
    position: "absolute",
    top: 180, // Debajo de la barra
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 4,
    borderRadius: 4,
    maxWidth: 80,
  },
  habitName: {
    fontSize: 10,
    color: "#fff",
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
  },
  activeTab: {
    borderBottomColor: "#4caf50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  dayDetail: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  habitItem: {
    fontSize: 14,
    color: "#333",
  },
  noHabits: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});