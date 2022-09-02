export class HtmlEditor<T extends object> {
    constructor(private readonly html: string) {}

    public edit(v: T): string {
        return Object.entries(v).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(key, 'g'), value);
        }, this.html);
    }
}