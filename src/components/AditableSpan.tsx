import React, {ChangeEvent, useState} from "react";
import TextField from "@mui/material/TextField";

export const AditableSpan = React.memo((props: AditableSpanPropsType) => {
    const [doubleClick, setDoubleClick] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.value)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onBlurInputHandler = () => {
        props.changeTitle(title)
        setDoubleClick(false)
    }

    const onDoubleClickSpanHandler = () => {
        setDoubleClick(true)
    }

    return <>
        {doubleClick
            ? <TextField autoFocus={true} value={title} onChange={onChangeInputHandler} onBlur={onBlurInputHandler} id="standard-basic" label="Standard" variant="standard" />
            : <span onDoubleClick={onDoubleClickSpanHandler}>{props.value}</span>}
    </>
})

// types
 type AditableSpanPropsType = {
     value: string
     changeTitle: (title: string) => void
 }
