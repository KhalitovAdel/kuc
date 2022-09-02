import { create, CreateOptions } from 'html-pdf';

export class HtmlToPdf {
    private readonly options?: CreateOptions

    constructor(options?: CreateOptions) {
        this.options = {
            format: 'A4',
            zoomFactor: '1',
            ...(options || {})
        }
    }

    public async convert(html: string): Promise<Buffer> {
        return new Promise((res, rej) => {
            create(html, this.options).toBuffer((err, buffer) => {
                if (err) return rej(err);

                return res(buffer);
            })
        })
    }
}