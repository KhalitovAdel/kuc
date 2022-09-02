import { IsEmail, IsEnum, IsString } from "class-validator";
import { User } from "../entity";

export class CreateUserDto implements Pick<Required<User>, 'email' | 'password'> {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsEnum(User.getRoles())
    role!: ReturnType<(typeof User)['getRoles']>[number];
}