import { CreateOrderDto } from '../../../server/dto';
import { CreatePageHok, ReadPageHok, ListPageHok } from '../default';
import { orderCreateFields, getOrderReadCells } from './order.cell';

// TODO: Form field error, form error if field not fined in form, global error??
// Styles
// Update Page

export const OrderCreatePage = CreatePageHok<CreateOrderDto>({ fields: orderCreateFields });

export const OrderReadPage = ReadPageHok({ cells: getOrderReadCells() });

export const OrderListPage = (pathname: string) => ListPageHok({ cells: getOrderReadCells(pathname) })