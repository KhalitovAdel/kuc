import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { Order } from "../entity";

export class CreateOrderDto implements Pick<Required<Order>, 'buildType' | 'area' | 'userId' | 'fullName'> {
    @IsEnum(Order.getBuildType())
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];
    
    @IsNumber()
    @Type(() => Number)
    area!: number;

    @IsNumber()
    @Type(() => Number)
    userId!: number;

    @IsString()
    @Type(() => String)
    fullName!: string;
}

export class UpdateOrderDto implements Pick<Required<Order>, 'buildType' | 'area' | 'fullName'> {
    @IsEnum(Order.getBuildType())
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];
    
    @IsNumber()
    @Type(() => Number)
    area!: number;

    @IsString()
    @Type(() => String)
    fullName!: string;
}