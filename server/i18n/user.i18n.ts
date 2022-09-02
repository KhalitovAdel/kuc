import { BaseEntity } from "typeorm";
import { i18nEntity, i18nProperty } from "../decorators";
import { User } from "../entity";

@i18nEntity(User, 'Пользователи')
export class UserI18n implements Required<Omit<User, keyof BaseEntity>> {
    @i18nProperty('Идентификатор')
    id!: number;

    @i18nProperty('Почта')
    email!: string;

    @i18nProperty('Пароль')
    password!: string;

    @i18nProperty<UserI18n['role']>('Тип строения', { admin: 'Администратор',  external_user: 'Простой пользователь'})
    role!: ReturnType<(typeof User)['getRoles']>[number];
}