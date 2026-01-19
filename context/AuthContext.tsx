import { auth, db } from "@/config/firebase";
import {
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const CURRENT_USER_KEY = "currentUser:v1";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type AuthState = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true, // SIEMPRE empezar con loading: true
    isAuthenticated: false, // SIEMPRE empezar con no autenticado
  });

  useEffect(() => {
    let mounted = true;

    // ESTRATEGIA DEFINITIVA: Forzar logout completo antes de cualquier cosa
    const initializeAuth = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        // Ignorar errores si no hay sesión
      }

      // Solo DESPUÉS del logout, configurar el listener
      if (!mounted) return;

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!mounted) return;

        if (user) {
          // Cargar perfil adicional desde Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userProfile = userDoc.exists()
              ? { id: user.uid, ...userDoc.data() } as UserProfile
              : null;

            if (mounted) {
              setAuthState({
                user,
                userProfile,
                loading: false,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            console.error("Error loading user profile:", error);
            if (mounted) {
              setAuthState({
                user,
                userProfile: null,
                loading: false,
                isAuthenticated: true,
              });
            }
          }
        } else {
          if (mounted) {
            setAuthState({
              user: null,
              userProfile: null,
              loading: false,
              isAuthenticated: false,
            });
          }
        }
      });

      return unsubscribe;
    };

    // Ejecutar inicialización
    initializeAuth();

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      if (mounted) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          isAuthenticated: false,
          user: null,
          userProfile: null,
        }));
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Error al iniciar sesión";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Cuenta deshabilitada";
          break;
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Actualizar display name en Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Guardar datos adicionales en Firestore
      const userProfile: UserProfile = {
        id: userCredential.user.uid,
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Error al registrar usuario";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Ya existe un usuario con este email";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es muy débil";
          break;
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!authState.user) return;

    try {
      // Actualizar en Firestore
      await setDoc(doc(db, "users", authState.user.uid), {
        ...authState.userProfile,
        ...updates,
      }, { merge: true });

      // Actualizar estado local
      setAuthState(prev => ({
        ...prev,
        userProfile: prev.userProfile ? { ...prev.userProfile, ...updates } : null,
      }));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }, [authState.user, authState.userProfile]);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}