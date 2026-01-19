import PrimaryButton from "@/components/PrimaryButton";
import Screen from "@/components/Screen";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const surface = useThemeColor({}, "surface");
  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const result = await register(email.trim(), password.trim(), name.trim());
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", result.error || "Error al registrar usuario");
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Crear Cuenta</ThemedText>
              <ThemedText style={styles.subtitle}>
                Únete a DiaDia y comienza tu viaje de hábitos
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nombre</ThemedText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={muted}
                  autoCapitalize="words"
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor={muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Contraseña</ThemedText>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={muted}
                  secureTextEntry
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Confirmar Contraseña</ThemedText>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={muted}
                  secureTextEntry
                  style={[
                    styles.input,
                    { backgroundColor: surface, borderColor: border, color: text },
                  ]}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
              </View>

              <PrimaryButton
                title="Crear Cuenta"
                onPress={handleRegister}
                disabled={loading}
              />

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.back()}
              >
                <ThemedText style={[styles.link, { color: text }]}>
                  ¿Ya tienes cuenta? Inicia sesión
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  link: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});