import React from "react";
import { App, PageView, PageViewProps } from "../../components";

export function ReadPageHok<T extends object>(originalProps: Pick<PageViewProps<T>, 'cells'>) {
    return App((props: Omit<PageViewProps<T>, 'cells'>) => {
        return <>
            <PageView cells={originalProps.cells} value={props.value} />
        </>
    })
}