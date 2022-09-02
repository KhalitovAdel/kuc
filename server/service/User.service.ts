import { User } from "../entity";
import { Repository } from 'typeorm';
import { CreateUserDto } from "../dto";
import { DuplicateException } from "../exception";

export class UserService {
    constructor(private readonly repository: Repository<User>) {}

    public async create(v: CreateUserDto): Promise<User> {
        const exists = await this.repository.count({ where: { email: v.email.toLowerCase() } }).then(d => !!d);
        if (exists) throw new DuplicateException(User.name);
        
        return await this.repository.save({...v, email: v.email.toLowerCase() });
    }

    public async canLogin(email: string, password: string): Promise<[true, User] | [false, null]>  {
        const user = await this.repository.findOne({ where: { email: email.toLowerCase(), password } });

        return user ? [true, user] : [false, user];
    }
}