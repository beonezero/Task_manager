import React, {ChangeEvent, useState} from 'react';

export const AddItemForm = (props: AddItemFormPropsType) => {
    const [title, setTitle] = useState("")
    const onClickButtonHandler = () => {
        props.addItem(props.todolistId, title)
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        <div>
            <input value={title} type="text" onChange={onChangeInputHandler}/>
            <button onClick={onClickButtonHandler}>{props.buttonName}</button>
        </div>
    );
}

//types

export type AddItemFormPropsType = {
    buttonName: string
    addItem: (todolistId: string, title: string) => void
    todolistId: string
}
