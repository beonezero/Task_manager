import React from 'react';

export const AddItemForm = (props: AddItemFormPropsType) => {
    return (
        <div>
            <input type="text"/>
            <button>{props.buttonName}</button>
        </div>
    );
}

//types

export type AddItemFormPropsType = {
    buttonName: string
}
