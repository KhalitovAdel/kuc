import { Repository } from "typeorm";
import { OrderToHtml } from "../adapter";
import { Order } from "../entity";
import { NotNullException } from "../exception";
import { HtmlEditor, HtmlToPdf } from "../util";

export class PrintOrderCase {
    constructor(
        private readonly repository: Repository<Order>,
        private readonly htmlEditor: HtmlEditor<OrderToHtml>,
        private readonly htmlToPdf: HtmlToPdf
    ) {}

    public async exec(orderId: number): Promise<Buffer> {
        const entity = await this.repository.findOne({ where: { id: orderId }});
        if (!entity) throw new NotNullException(Order.name);

        const html = this.htmlEditor.edit(new OrderToHtml(entity));

        return this.htmlToPdf.convert(html);
    }
}