import {ChangeEvent, useState} from "react";

export const AditableSpan = (props: AditableSpanPropsType) => {
    const [doubleClick, setDoubleClick] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")

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

    return <div>
        {doubleClick
            ? <input value={title} onChange={onChangeInputHandler} onBlur={onBlurInputHandler}/>
            : <span onDoubleClick={onDoubleClickSpanHandler}>{props.value}</span>}
    </div>
}

// types
 type AditableSpanPropsType = {
     value: string
     changeTitle: (title: string)=> void
 }
