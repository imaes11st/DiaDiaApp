import { db } from "@/config/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAuth } from "./AuthContext";

export type Profile = {
  name: string;
  role: string;
  avatarUri?: string | null; // local/remote
};

type Ctx = {
  loading: boolean;
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  setAvatar: (uri: string | null) => Promise<void>;
};

const defaultProfile: Profile = {
  name: "Tu nombre",
  role: "Profesión",
  avatarUri: null,
};

const ProfileContext = createContext<Ctx>({
  loading: true,
  profile: defaultProfile,
  updateProfile: async () => {},
  setAvatar: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    // Escuchar cambios en tiempo real en el perfil
    const profileRef = doc(db, "profiles", user.uid);
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const profileData = doc.data() as Profile;
        setProfile(profileData);
      } else {
        // Si no existe perfil, crear uno por defecto
        setProfile(defaultProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading profile:", error);
      setProfile(defaultProfile);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isAuthenticated]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!user) return;

      try {
        const updatedProfile = { ...profile, ...patch };
        setProfile(updatedProfile);

        // Guardar en Firestore
        await setDoc(doc(db, "profiles", user.uid), updatedProfile, { merge: true });
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    [profile, user]
  );

  const setAvatar = useCallback(
    async (uri: string | null) => {
      if (!user) return;

      try {
        const updatedProfile = { ...profile, avatarUri: uri };
        setProfile(updatedProfile);

        // Guardar en Firestore
        await setDoc(doc(db, "profiles", user.uid), updatedProfile, { merge: true });
      } catch (error) {
        console.error("Error setting avatar:", error);
        throw error;
      }
    },
    [profile, user]
  );

  const value = useMemo(
    () => ({ loading, profile, updateProfile, setAvatar }),
    [loading, profile, updateProfile, setAvatar]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}