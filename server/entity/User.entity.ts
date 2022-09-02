import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    email!: string;

    @Column("text")
    password!: string;

    @Column({enum: User.getRoles(), type: "text"})
    role!: ReturnType<(typeof User)['getRoles']>[number];

    public static getRoles() {
        return ['admin', 'external_user'] as const;
    }
}