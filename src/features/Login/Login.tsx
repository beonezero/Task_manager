import React from "react"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "App/store"
import { Navigate } from "react-router-dom"
import { authThunks } from "features/Login/auth-reducer"

export const Login = React.memo(() => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      // const errors: FormikErrorType = {}
      // if (!values.email) {
      //   errors.email = "Required"
      // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      //   errors.email = "Invalid email address"
      // }
      // if (!values.password) {
      //   errors.password = "Required"
      // } else if (values.password.length < 5) {
      //   errors.password = "Most be more 5 symbols"
      // }
      // return errors
    },
    onSubmit: (data) => {
      dispatch(authThunks.login(data))
    },
  })
  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                {" "}
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                name={"email"}
                onChange={formik.handleChange}
                helperText={formik.touched.email && formik.errors.email}
                error={!!(formik.touched.email && formik.errors.email)}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              <TextField
                type="password"
                label="Password"
                name={"password"}
                onChange={formik.handleChange}
                value={formik.values.password}
                margin="normal"
                helperText={formik.touched.password && formik.errors.password}
                error={!!(formik.touched.password && formik.errors.password)}
                onBlur={formik.handleBlur}
              />
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox name={"rememberMe"} onChange={formik.handleChange} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
})

export type LoginDataType = {
  email: string
  password: string
  rememberMe: boolean
}

type FormikErrorType = {
  email?: string
  password?: string
}
