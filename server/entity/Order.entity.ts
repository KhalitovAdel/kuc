import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO createdAt, fullName
@Entity()
export class Order extends BaseEntity  {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    price!: number;

    @Column({enum: Order.getBuildType(), type: "text"})
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];

    @Column("int")
    area!: number;

    @Column("int")
    userId!: number;

    @Column({type: "text"})
    fullName!: string;

    // @Column('timestamp', {
    //     default: () => 'CURRENT_TIMESTAMP',
    //     transformer: {
    //         from: (d) => d.getTime(),
    //         to: (t) => new Date(t)
    //     }
    // })
    @CreateDateColumn()
    public createdAt!: Date;

    public static getBuildType() {
        return ['flat', 'house'] as const;
    }
}