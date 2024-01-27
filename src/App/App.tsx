import s from "./App.module.css"
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";


export const App = () => {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return <div className={s.App}>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
        {status === "loading" && <LinearProgress color="error" />}
        <ErrorSnackbar/>
        <Container fixed>
            <Routes>
                <Route path={"/"} element={<TodolistList/>}/>
                <Route path={"login"} element={<Login/>}/>
                <Route path={"404"} element={<div><h1>404: PAGE NOT FOUND</h1></div>}/>
                <Route path={"*"} element={<Navigate to={"404"}/>}/>
            </Routes>
        </Container>
    </div>
}

