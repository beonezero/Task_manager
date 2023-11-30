import {ChangeEvent, useState} from "react";

export const AditableSpan = (props: AditableSpanPropsType) => {
    const [doubleClick, setDoubleClick] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.value)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onBlurInputHandler = () => {
        props.changeTaskTitle!(props.taskId!,title)
        props.changeTodolistTitle()
        setDoubleClick(false)
    }

    const onDoubleClickSpanHandler = () => {
        setDoubleClick(true)
    }

    return <>
        {doubleClick
            ? <input autoFocus={true}  value={title} onChange={onChangeInputHandler} onBlur={onBlurInputHandler}/>
            : <span onDoubleClick={onDoubleClickSpanHandler}>{props.value}</span>}
    </>
}

// types
 type AditableSpanPropsType = {
     value: string
     changeTaskTitle?: (taskId: string, title: string)=> void
     changeTodolistTitle?: (title: string)=> void
     taskId?: string
 }
