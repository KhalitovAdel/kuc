import { BaseEntity } from "typeorm";
import { i18nEntity, i18nProperty } from "../decorators";
import { Order } from "../entity";

@i18nEntity(Order, 'Заказы')
export class OrderI18n implements Required<Omit<Order, keyof BaseEntity>> {
    @i18nProperty('Идентификатор')
    id!: number;

    @i18nProperty('Цена')
    price!: number;

    @i18nProperty<OrderI18n['buildType']>('Тип строения', { flat: 'Квартира', house: 'Загородный дом' })
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];

    @i18nProperty('Площадь')
    area!: number;

    @i18nProperty('Идентификатор пользователя')
    userId!: number;

    @i18nProperty('ФИО')
    fullName!: string;

    @i18nProperty('Дата создания')
    public createdAt!: Date;
}