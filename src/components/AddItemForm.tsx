import React, {ChangeEvent, useState, KeyboardEvent} from 'react';

export const AddItemForm = (props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onClickButtonHandler = () => {
        if (title.trim().length > 0) {
            props.addItem(title.trim())
            setTitle("")
            setError("")
        } else {setError("Error")}
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            onClickButtonHandler()
        }
    }

    return (
        <div>
            <h4>{error}</h4>
            <input onKeyPress={onKeyDownHandler} value={title} type="text" onChange={onChangeInputHandler}/>
            <button onClick={onClickButtonHandler}>{props.buttonName}</button>
        </div>
    );
}

//types

export type AddItemFormPropsType = {
    buttonName: string
    addItem: (title: string) => void

}
