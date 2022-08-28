import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    price!: number;

    @Column({enum: Order.getBuildType(), type: "text"})
    buildType!: ReturnType<(typeof Order)['getBuildType']>[number];

    @Column("int")
    area!: number;

    public static getBuildType() {
        return ['flat', 'house'] as const;
    }
}