export interface Cell<T extends object> {
    title: JSX.Element;
    render: (v: T) => JSX.Element;
}