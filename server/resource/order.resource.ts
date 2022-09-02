import { Order } from "../entity";
import { CreateOrderDto, UpdateOrderDto } from "../dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { OrderService } from "../service";
import { CreateResourceHandler, UpdateResourceHandler } from "./interface";


export class OrderResourceHandler implements CreateResourceHandler<Order, CreateOrderDto>, UpdateResourceHandler<Order, UpdateOrderDto> {
    constructor(private readonly service: OrderService) {}

    public async create(toCreate: CreateOrderDto, userId: number): Promise<Order> {
        const createDto: CreateOrderDto = plainToInstance(CreateOrderDto, {...toCreate, userId});
        
        await validateOrReject(createDto, { whitelist: true });
        return await this.service.create(createDto); 
    }

    public async update(id: number, toUpdate: UpdateOrderDto): Promise<Order> {
        const updateDto: UpdateOrderDto = plainToInstance(UpdateOrderDto, toUpdate);
        
        await validateOrReject(updateDto, { whitelist: true });
        return await this.service.update(id, updateDto); 
    }
}