import { useAppSelector } from "app/store"

export const tasksSelectors = {
  useTasksSelectors: () => useAppSelector((state) => state.tasks),
}
