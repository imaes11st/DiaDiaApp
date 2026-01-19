// Ejemplo de HabitsContext con Firebase
import { db } from "@/config/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { Habit, Priority } from "../types/habit";
import { useAuth } from "./AuthContextFirebase";

type HabitsContextType = {
  habits: Habit[];
  loading: boolean;
  addHabit: (title: string, priority?: Priority) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextType>({} as HabitsContextType);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    // Escuchar cambios en tiempo real
    const q = query(
      collection(db, "habits"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addHabit = async (title: string, priority: Priority = "low") => {
    if (!user) return;

    await addDoc(collection(db, "habits"), {
      title,
      priority,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      lastDoneAt: null,
      streak: 0,
    });
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const wasDoneToday = habit.lastDoneAt?.split('T')[0] === today;

    await updateDoc(doc(db, "habits", id), {
      lastDoneAt: wasDoneToday ? null : new Date().toISOString(),
      streak: wasDoneToday ? Math.max(0, habit.streak - 1) : habit.streak + 1,
    });
  };

  const deleteHabit = async (id: string) => {
    await deleteDoc(doc(db, "habits", id));
  };

  return (
    <HabitsContext.Provider value={{ habits, loading, addHabit, toggleHabit, deleteHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}