import { Type } from "class-transformer";
import { IsEnum, IsNumber } from "class-validator";
import { Order } from "../entity";

export class CreateOrderDto implements Pick<Required<Order>, 'buildType' | 'area'> {
    @IsEnum(Order.getBuildType())
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];
    
    @IsNumber()
    @Type(() => Number)
    area!: number;
}