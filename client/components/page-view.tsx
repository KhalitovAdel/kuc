import React from "react";
import { Cell } from "../interface";


export interface PageViewProps<T extends object> {
    cells: Cell<T>[];
    value: T;
}

export function PageView<T extends object>(props: PageViewProps<T>) {
    return <>
        {props.cells.map((c, i) => <p key={`${i}`}>
            <span style={{fontWeight: 'bold'}}>{c.title}: </span> {c.render(props.value)}
        </p>)}
    </>
}