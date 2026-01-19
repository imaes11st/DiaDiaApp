import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AuthDebug() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ThemedText>Cargando...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>
        Estado de Autenticación
      </ThemedText>

      <View style={styles.info}>
        <ThemedText>Autenticado: {isAuthenticated ? "✅ Sí" : "❌ No"}</ThemedText>
        <ThemedText>Usuario: {user?.email || "Ninguno"}</ThemedText>
        <ThemedText>UID: {user?.uid || "Ninguno"}</ThemedText>
      </View>

      {isAuthenticated && (
        <TouchableOpacity style={styles.button} onPress={logout}>
          <ThemedText style={styles.buttonText}>Cerrar Sesión</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  info: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});