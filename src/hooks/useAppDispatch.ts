import { useDispatch } from "react-redux"
import { AppThunkDispatch } from "../app/store"

// export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
