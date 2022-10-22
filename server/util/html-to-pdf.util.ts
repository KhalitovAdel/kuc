import { generatePdf, Options } from 'html-pdf-node';

export class HtmlToPdf {
    private readonly options: Options;

    constructor(options?: Options) {
        this.options = {
            format: 'A4',
            width: 600,
            height: 800,
            scale: 1.5,
            ...(options || {})
        }
    }

    public async convert(html: string): Promise<Buffer> {
        return new Promise((res, rej) => {
            generatePdf({ content: html }, this.options, (err, b) => {
                if (err) return rej(err);
                return res(b);
            })
        })
    }
}