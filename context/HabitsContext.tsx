import { Habit, Priority } from "@/types/habit";
import { isSameDay, isYesterday, toISO } from "@/utils/date";

type State = { loading: boolean; habits: Habit[] };

type Action =
  | { type: "HYDRATE"; payload: Habit[] }
  | { type: "ADD"; title: string; priority?: Priority }
  | { type: "TOGGLE"; id: string; today: Date };

const STORAGE_KEY = "habits:v1";

const initialState: State = { loading: true, habits: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { loading: true, habits: action.payload };
    case "ADD": {
      const now = new Date();
      const newHabit: Habit = {
        id: `h${Date.now()}`,
        title: action.title,
        priority: action.priority ?? "low",
        createdAt: toISO(now),
        lastDoneAt: null,
        streak: 0,
      };
      return { ...state, habits: [newHabit, ...state.habits] };
    }

    case "TOGGLE": {
      const { id, today } = action;
      const todayISO = toISO(today);
      const updated = state.habits.map((h) => {
        if (h.id !== id) return h;

        const last = h.lastDoneAt ? new Date(h.lastDoneAt) : null;
        const yaHechoHoy = last ? isSameDay(today, last) : false;

        if (yaHechoHoy) {
          return {
            ...h,
            streak: Math.max(0, h.streak - 1),
            lastDoneAt: null,
          };
        }

        let newStreak = 1;

        if (last && isYesterday(today, last)) {
          newStreak = h.streak + 1;
        } else {
          newStreak = 1;
        }

        return {
          ...h,
          streak: newStreak,
          lastDoneAt: todayISO,
        };
      });
      return { ...state, habits: updated };
    }
    default:
      return state;
  }
}