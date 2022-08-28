import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { PaginationDto } from '../dto/Pagination.dto';
import { User } from '../entity';
import { DuplicateException, NotNullException } from '../exception';
import { handleRoute } from './utils';

export function getUserRouter(repository: Repository<User>): Router {
    const userRouter = Router();


    userRouter.post('/', handleRoute(async (req, res) => {
        const createDto = plainToInstance(CreateUserDto, req.body);

        await validateOrReject(createDto);

        const exists = await repository.count({ where: { email: createDto.email.toLowerCase() } }).then(d => !!d);

        if (exists) throw new DuplicateException(User.name);
        
        const entity = await repository.save({...createDto, email: createDto.email.toLowerCase() });

        return res.status(201).send(entity);
    }))

    userRouter.get('/', handleRoute(async (req, res) => {
        const pagination = plainToInstance(PaginationDto, req.query);
        const [queries, count] = await repository.findAndCount({ skip: pagination.skip, take: pagination.limit })
        
        return res.status(200).send({
            queries,
            count,
        });
    }))

    userRouter.get('/:id', handleRoute(async (req, res) => {
        const entity = await repository.findOneBy({ id: Number(req.params.id) });

        if (!entity) throw new NotNullException(User.name);

        return res.status(200).send(entity);
    }))

    return userRouter;
}