import { db } from "@/config/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer
} from "react";
import { Habit, Priority } from "../types/habit";
import { isSameDay, isYesterday, toISO } from "../utils/date";
import { useAuth } from "./AuthContext";

// --- Estado y acciones ---
type State = {
  loading: boolean;
  habits: Habit[];
};

type Action =
  | { type: "HYDRATE"; payload: Habit[] }
  | { type: "ADD"; payload: Habit }
  | { type: "UPDATE"; payload: Habit }
  | { type: "DELETE"; payload: string };

const initialState: State = { loading: true, habits: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { loading: false, habits: action.payload };
    case "ADD":
      return { ...state, habits: [action.payload, ...state.habits] };
    case "UPDATE":
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h)
      };
    case "DELETE":
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
    default:
      return state;
  }
}

type HabitsCtx = {
  loading: boolean;
  habits: Habit[];
  addHabit: (title: string, priority?: Priority) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsCtx | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Cargar hábitos desde Firestore cuando el usuario cambia
  useEffect(() => {
    if (!isAuthenticated || !user) {
      dispatch({ type: "HYDRATE", payload: [] });
      return;
    }

    // Escuchar cambios en tiempo real en Firestore
    const q = query(
      collection(db, "habits"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habits: Habit[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];

      dispatch({ type: "HYDRATE", payload: habits });
    }, (error) => {
      console.error("Error loading habits:", error);
      dispatch({ type: "HYDRATE", payload: [] });
    });

    return unsubscribe;
  }, [user, isAuthenticated]);

  const addHabit = useCallback(async (title: string, priority?: Priority) => {
    if (!user) return;

    try {
      const now = new Date();
      const newHabit: Omit<Habit, 'id'> = {
        title: title.trim(),
        priority: priority ?? "low",
        createdAt: toISO(now),
        lastDoneAt: null,
        streak: 0,
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, "habits"), newHabit);
      const habitWithId: Habit = { id: docRef.id, ...newHabit };

      dispatch({ type: "ADD", payload: habitWithId });
    } catch (error) {
      console.error("Error adding habit:", error);
      throw error;
    }
  }, [user]);

  const toggleHabit = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const habit = state.habits.find(h => h.id === id);
      if (!habit) return;

      const today = new Date();
      const todayISO = toISO(today);
      const last = habit.lastDoneAt ? new Date(habit.lastDoneAt) : null;
      const yaHechoHoy = last ? isSameDay(today, last) : false;

      let newStreak = habit.streak;
      let newLastDoneAt = habit.lastDoneAt;

      // Si estaba marcado HOY → desmarcar: restar 1 (mín 0) y limpiar lastDoneAt
      if (yaHechoHoy) {
        newStreak = Math.max(0, habit.streak - 1);
        newLastDoneAt = null;
      } else {
        // Si NO estaba marcado hoy → marcar
        if (last && isYesterday(today, last)) {
          newStreak = habit.streak + 1; // venías de ayer → cadena continúa
        } else {
          newStreak = 1; // reinicia (hoy es el primer día)
        }
        newLastDoneAt = todayISO;
      }

      const updatedHabit: Habit = {
        ...habit,
        streak: newStreak,
        lastDoneAt: newLastDoneAt,
      };

      await updateDoc(doc(db, "habits", id), {
        streak: newStreak,
        lastDoneAt: newLastDoneAt,
      });

      dispatch({ type: "UPDATE", payload: updatedHabit });
    } catch (error) {
      console.error("Error toggling habit:", error);
      throw error;
    }
  }, [user, state.habits]);

  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "habits", id));
      dispatch({ type: "DELETE", payload: id });
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  }, [user]);

  const value = useMemo<HabitsCtx>(
    () => ({
      loading: state.loading,
      habits: state.habits,
      addHabit,
      toggleHabit,
      deleteHabit,
    }),
    [state.loading, state.habits, addHabit, toggleHabit, deleteHabit]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits debe usarse dentro de HabitsProvider");
  return ctx;
}