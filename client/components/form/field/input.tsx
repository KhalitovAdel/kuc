import { Input, InputProps } from "@mui/material";
import React from "react";
import { FormElement } from "../interface";

export class FormInput implements FormElement {
    constructor(private readonly label: string, private readonly options?: InputProps) {}

    public render(fieldName: string): JSX.Element {
        return <Input required={true} {...(this.options || {})} name={fieldName}/>
    }

    public getLabelText(): string {
        return this.label;
    }
}