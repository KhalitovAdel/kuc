import React from "react";
import { Form, FormProps } from "../../components";
import { App } from '../../components/app';

export function CreatePageHok<T extends object>(props: Pick<FormProps<T>, 'fields'>) {
    return App(() => <Form<T> {...props}/>)
}