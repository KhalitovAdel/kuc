export interface FormElement {
    render(fieldName: string): JSX.Element;

    getLabelText(): string
}