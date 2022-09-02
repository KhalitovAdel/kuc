import { User } from "../entity";
import { CreateUserDto } from "../dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UserService } from "../service";
import { CreateResourceHandler } from "./interface";


export class UserResourceHandler implements CreateResourceHandler<User, CreateUserDto> {
    constructor(private readonly service: UserService) {}

    public async create(toCreate: CreateUserDto): Promise<User> {
        const createDto: CreateUserDto = plainToInstance(CreateUserDto, toCreate);
        
        await validateOrReject(createDto, { whitelist: true });
        return await this.service.create(createDto); 
    }
}