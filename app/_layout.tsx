import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import LoadingScreen from "@/components/LoadingScreen";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CelebrationProvider } from "@/context/CelebrationProvider";
import { HabitsProvider } from "@/context/HabitsContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const colorScheme = useColorScheme();

  // Mostrar pantalla de carga mientras se verifica autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <HabitsProvider>
        <ProfileProvider>
          <CelebrationProvider>
            <Stack>
              {isAuthenticated ? (
                <>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal", title: "Modal" }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="register" options={{ headerShown: false }} />
                </>
              )}
            </Stack>
            <StatusBar style="auto" />
          </CelebrationProvider>
        </ProfileProvider>
      </HabitsProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}