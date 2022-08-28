import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { OrderCreatePage, OrderListPage, OrderReadPage } from '../../client/pages';
import { CreateOrderDto } from '../dto';
import { PaginationDto } from '../dto/Pagination.dto';
import { Order } from '../entity';
import { NotNullException } from '../exception';
import { Renderer } from '../renderer';
import { handleRoute } from './utils';

export function getOrderRouter(repository: Repository<Order>, renderer: Renderer): Router {
    const orderRouter = Router();

    orderRouter.post('/', handleRoute(async (req, res) => {
        const createDto: CreateOrderDto = plainToInstance(CreateOrderDto, req.body);
        await validateOrReject(createDto);

        const pricePerType = createDto.buildType === "flat" ? 50 : 100;
        
        const entity = await repository.save({...createDto, price: createDto.area * pricePerType });

        return res.redirect(`${req.baseUrl}/${entity.id}`);
    }))

    orderRouter.get('/', handleRoute(async (req) => {
        const pagination = plainToInstance(PaginationDto, req.query);
        
        const [values, count] = await repository.findAndCount({ skip: pagination.skip, take: pagination.limit })
        if (req.query.create) return renderer.renderDom(OrderCreatePage, {});
        return renderer.renderDom(OrderListPage(req.baseUrl), { count, values, current: pagination.skip, pageCount: pagination.limit });
    }))

    orderRouter.get('/:id', handleRoute(async (req) => {
        const entity = await repository.findOneBy({ id: Number(req.params.id) });

        if (!entity) throw new NotNullException(Order.name);

        return renderer.renderDom(OrderReadPage, { value: entity });
    }))

    return orderRouter;
}