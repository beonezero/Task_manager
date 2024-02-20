import { useAppSelector } from "app/store"

export const todolistsSelectors = {
  useTodolistsSelectors: () => useAppSelector((state) => state.todolists),
}
