import { ThemedText } from "@/components/themed-text";
import { useHabits } from "@/context/HabitsContext";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function Badges() {
  const { habits } = useHabits();

  const badges = useMemo(() => {
    const earnedBadges: string[] = [];

    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const totalCompleted = habits.reduce((sum, h) => sum + h.streak, 0);

    if (maxStreak >= 7) earnedBadges.push("Semanal");
    if (maxStreak >= 30) earnedBadges.push("Mensual");
    if (totalCompleted >= 100) earnedBadges.push("Centenario");
    if (habits.length >= 5) earnedBadges.push("Hábituante");

    return earnedBadges;
  }, [habits]);

  if (badges.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Tus Logros</ThemedText>
      <View style={styles.badgesRow}>
        {badges.map((badge) => (
          <View key={badge} style={styles.badge}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
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
    backgroundColor: "#fff3cd",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});