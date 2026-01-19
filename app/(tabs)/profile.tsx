import Avatar from "@/components/Avatar";
import PrimaryButton from "@/components/PrimaryButton";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useHabits } from "@/context/HabitsContext";
import { useProfile } from "@/context/ProfileContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { generateAvatarAI } from "@/services/avatar";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

export default function Profile() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { loading, profile, updateProfile, setAvatar } = useProfile();
  const { habits } = useHabits();
  const surface = useThemeColor({}, "surface");
  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [busy, setBusy] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Placeholder

  useEffect(() => {
    setName(profile.name);
    setRole(profile.role);
  }, [profile.name, profile.role]);

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const totalCompleted = habits.reduce((sum, h) => sum + h.streak, 0);
    const weeklyCompleted = habits.filter(h => h.lastDoneAt && new Date(h.lastDoneAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    return { totalHabits, maxStreak, totalCompleted, weeklyCompleted };
  }, [habits]);

  async function save() {
    setBusy(true);
    await updateProfile({
      name: name.trim() || "sin nombre",
      role: role.trim() || "sin role",
    });
    setBusy(false);
    Alert.alert("Perfil", "Datos guardados");
  }

  async function handleLogout() {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  }

  async function pickFromGallery() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) await setAvatar(res.assets[0].uri);
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permisos", "Se necesita permiso de cámara");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) await setAvatar(res.assets[0].uri);
  }

  async function makeAI() {
    setBusy(true);
    const url = await generateAvatarAI(name || "Usuario");
    await setAvatar(url);
    setBusy(false);
  }

  if (loading) {
    return (
      <Screen>
        <ThemedText>Cargando perfil…</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sección Perfil */}
          <View style={[styles.section, { backgroundColor: surface }]}>
            <ThemedText style={styles.sectionTitle}>Mi Perfil</ThemedText>
            <View style={{ alignItems: "center", gap: 12 }}>
              <Avatar
                name={name}
                uri={profile.avatarUri}
                onPress={pickFromGallery}
              />
              <ThemedText style={{ color: muted }}>Toca para cambiar avatar</ThemedText>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <ThemedText style={styles.label}>Nombre</ThemedText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  placeholderTextColor={muted}
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="next"
                />
              </View>
              <View>
                <ThemedText style={styles.label}>Profesión</ThemedText>
                <TextInput
                  value={role}
                  onChangeText={setRole}
                  placeholder="Tu profesión"
                  placeholderTextColor={muted}
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="done"
                />
              </View>
              <PrimaryButton title="Guardar Cambios" onPress={save} disabled={busy} />
            </View>
          </View>

          {/* Sección Estadísticas */}
          <View style={[styles.section, { backgroundColor: surface }]}>
            <ThemedText style={styles.sectionTitle}>Mis Estadísticas</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.stat}>
                <ThemedText style={styles.statNumber}>{stats.totalHabits}</ThemedText>
                <ThemedText style={styles.statLabel}>Hábitos Totales</ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={styles.statNumber}>{stats.maxStreak}</ThemedText>
                <ThemedText style={styles.statLabel}>Racha Máxima</ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={styles.statNumber}>{stats.totalCompleted}</ThemedText>
                <ThemedText style={styles.statLabel}>Completados Totales</ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={styles.statNumber}>{stats.weeklyCompleted}</ThemedText>
                <ThemedText style={styles.statLabel}>Esta Semana</ThemedText>
              </View>
            </View>
          </View>

          {/* Sección Configuración */}
          <View style={[styles.section, { backgroundColor: surface }]}>
            <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>
            <View style={styles.setting}>
              <ThemedText>Notificaciones</ThemedText>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>
            <PrimaryButton title="Generar Avatar IA" onPress={makeAI} />
            <View style={{ marginTop: 16 }}>
              <PrimaryButton
                title="Cerrar Sesión"
                onPress={handleLogout}
                style={{ backgroundColor: '#ef4444' }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  stat: {
    flex: 1,
    minWidth: 80,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});