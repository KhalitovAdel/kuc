import { Button, FormControl, FormLabel } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { FormElement } from "./interface";

export interface FormProps<T> {
    fields: Record<keyof T, FormElement>;
}

export function Form<T>(props: FormProps<T>) {
    const { pathname } = useLocation();
    return <form method='POST' action={pathname}>
        {Object.entries<FormElement>(props.fields).map(([fieldName, e]) => (<FormControl key={fieldName}>
                <FormLabel>{e.getLabelText()}</FormLabel>
                {e.render(fieldName)}
            </FormControl>))}
        <Button type="submit">Создать</Button>
    </form>
}