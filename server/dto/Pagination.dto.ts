import { Transform, Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDto {
    @IsNumber()
    @Type(() => Number) 
    skip: number = 0;

    @IsNumber()
    @Transform(({ value }) => {
        if (isNaN(+value)) return 10;

        return +value > 200 ? 200 : +value
    }) 
    limit: number = 10;
}