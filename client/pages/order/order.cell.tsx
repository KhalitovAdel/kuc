import React from "react";
import { Link } from "react-router-dom";
import { CreateOrderDto } from "../../../server/dto";
import { Order } from "../../../server/entity";
import { FormInput, FormSelect } from "../../components";
import { Cell } from "../../interface";

export function getOrderReadCells(pathname?: string): Cell<Order>[] {
    return [
        {
            title: <>Идентификатор</>,
            render: (v) => pathname ? <Link to={`${pathname}/${v.id}`}>{v.id}</Link> : <>{v.id}</>
        },
        {
            title: <>Площадь</>,
            render: (v) => <>{v.area} м²</>
        },
        {
            title: <>Тип</>,
            render: (v) => <>{v.buildType === 'flat' ? 'квартира' : 'коттедж'}</>
        },
        {
            title: <>Цена</>,
            render: (v) => <>{v.price.toLocaleString('ru')} ₽</>
        },
    ]
}

export const orderCreateFields = {
    area: new FormInput('Площадь'),
    buildType: new FormSelect<CreateOrderDto['buildType']>('Тип строения', {
        flat: 'Квартира',
        house: 'Коттедж'
    })
}