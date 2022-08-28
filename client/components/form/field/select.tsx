import { NativeSelect } from "@mui/material";
import React from "react";
import { FormElement } from "../interface";

export class FormSelect<T extends (string | number)> implements FormElement {
    constructor(private readonly label: string, private readonly fieldMap: Record<T, string>) {}

    public getLabelText(): string {
        return this.label;
    }

    render(fieldName: string): JSX.Element {
        return <NativeSelect required={true} name={fieldName}>
            {Object.entries<string>(this.fieldMap).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </NativeSelect>
    }
}