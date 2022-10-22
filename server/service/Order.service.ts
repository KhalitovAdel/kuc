import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { Order } from '../entity';
import { NotNullException } from '../exception';

export class OrderService {
    constructor(
        private readonly repository: Repository<Order>) {}

    public async create(v: CreateOrderDto): Promise<Order> {
        return await this.repository.save({...v, price: this.getPrice(v.area, v.buildType) });
    }

    public async update(id: number, v: UpdateOrderDto): Promise<Order> {
        const exists = await this.repository.findOne({ where: { id } });

        if (!exists) throw new NotNullException(Order.name);
        const price = v.area || v.buildType 
            ? this.getPrice(v.area || exists.area, v.buildType || exists.buildType)
            : exists.price;

        return Object.assign(exists, {...v, price }).save();
    }

    public async get(orderId: number): Promise<Order> {
        const entity = await this.repository.findOne({ where: { id: orderId }});
        if (!entity) throw new NotNullException(Order.name);

        return entity;
    }

    private getPrice(area: Order['area'], type: Order['buildType']): number {
        if (type === 'flat') return this.getFlatPrice(area);

        return this.getHousePrice(area);
    }

    /**
     *  Готовый дом:
        До 100 - 14000
        До 150 - 16000
        До 200 - 22000
        До 300 - 34000
        До 400 - 45000
        До 500 - 58000
        С 501 - 120/м2
    */
    private getHousePrice(area: Order['area']): number {
        if (area <= 100) return 14000;
        if (area <= 150) return 16000;
        if (area <= 200) return 22000;
        if (area <= 300) return 34000;
        if (area <= 400) return 45000;
        if (area <= 500) return 58000;

        return area * 120;
    }

    /**
     *  Готовая квартира
        До 40 - 7000
        До 70 - 12000
        До 100 - 16000
        С 101 - 175/м2
    */
    private getFlatPrice(area: Order['area']): number {
        if (area <= 40) return 7000;
        if (area <= 70) return 12000;
        if (area <= 100) return 16000;

        return area * 175;
    }
}