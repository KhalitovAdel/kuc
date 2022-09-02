import { Order } from "../entity";

export class OrderToHtml {
    '<<ID>>': number;
    '<<PRICE>>': string;
    '<<BUILD_TYPE>>': string;
    '<<AREA>>': number;
    '<<FULL_NAME>>': string;
    '<<CREATED_AT>>': string;

    constructor(order: Order) {
        this["<<ID>>"] = order.id;
        this["<<PRICE>>"] = order.price.toLocaleString('ru');
        this["<<BUILD_TYPE>>"] = order.buildType === 'house' ? 'готового дома' : 'готовой квартиры';
        this["<<AREA>>"] = order.area;
        this["<<FULL_NAME>>"] = order.fullName;
        this["<<CREATED_AT>>"] = order.createdAt.toLocaleDateString('ru', { timeZone: 'Europe/Moscow' });
    }
}