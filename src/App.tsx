import {Todolist} from "./components/Todolist";
import s from "./App.module.css"
import {AddItemForm} from "./components/AddItemForm";
import {useAppDispatch, useAppSelector} from "./store/store";
import {addTodolistAC, changeFilterAC, FilterType, removeTodolistAC} from "./components/todolist-reducer";
import {addTaskAC, removeTaskAC} from "./components/task-reducer";

export const App = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(store => store.todolist)
    const tasks = useAppSelector(store => store.task)

    const todolistId = "todolist4"
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title, todolistId ))
    }
    const removeTodolist = (todolistId: string) => {
        console.log(todolistId)
        dispatch(removeTodolistAC(todolistId))
    }

    const addTask = (todolistId: string, title: string) => {
        dispatch(addTaskAC(todolistId,title))
    }
    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC(todolistId, taskId))
    }

    const changeFilter = (todolistId: string, filter: FilterType) => {
        dispatch(changeFilterAC(todolistId, filter))
    }

    return <div className={s.App}>
        <div className={s.AddTask}>
            <h2>Add Task</h2>
            <AddItemForm buttonName={"+"} addItem={addTodolist} todolistId={todolistId}/>
        </div>
        <div className={s.Todolist}>
            {todolists.map(td => {
                let allTodolistTasks = tasks[td.id]
                if (td.filter === "active"){
                    allTodolistTasks = tasks[td.id].filter(t => !t.isDone)
                }
                if (td.filter === "completed"){
                    allTodolistTasks = tasks[td.id].filter(t => t.isDone)
                }
                return <Todolist key={td.id}
                                 todolist={td}
                                 todolistId={td.id}
                                 removeTodolist={removeTodolist}
                                 tasks={allTodolistTasks}
                                 addTask={addTask}
                                 removeTask={removeTask}
                                 changeFilter={changeFilter}
                />
            })}
        </div>
    </div>

}

// types
