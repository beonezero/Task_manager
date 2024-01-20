import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {AddBox} from "@mui/icons-material";
import {IconButton, TextField} from "@mui/material";

export const AddItemForm = ({addItem}: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onClickButtonHandler = () => {
        if (title.trim().length > 0) {
            addItem(title.trim())
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
            <TextField variant="outlined"
                       error={!!error}
                       value={title}
                       onChange={onChangeInputHandler}
                       onKeyPress={onKeyDownHandler}
                       label="Title"
                       helperText={error}
            />
            <IconButton color="primary" onClick={onClickButtonHandler}>
                <AddBox/>
            </IconButton>
        </div>
    );
}

//types

export type AddItemFormPropsType = {
    addItem: (title: string) => void
}
