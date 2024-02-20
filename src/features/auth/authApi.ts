import { instance } from "common/api"
import { BaseResponseType } from "common/types"
import { AxiosResponse } from "axios"
import { LoginParamsType } from "features/auth/Login/Login"

export const authAPI = {
  me() {
    return instance.get<BaseResponseType<UserType>>("auth/me")
  },
  login(data: LoginParamsType) {
    return instance.post<null, AxiosResponse<BaseResponseType<{ userId: number }>>, LoginParamsType>("auth/login", data)
  },
  logout() {
    return instance.delete<BaseResponseType>("auth/login")
  },
}

//types
export type UserType = {
  id: number
  email: string
  login: string
}
