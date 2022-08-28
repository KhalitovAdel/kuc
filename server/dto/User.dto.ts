import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { User } from "../entity";

export class CreateUserDto implements Pick<Required<User>, 'email' | 'password'> {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}