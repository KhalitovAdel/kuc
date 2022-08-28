import { DataSource, EntitySchema, MixedList } from "typeorm";

export async function createDatabase(entities: MixedList<Function | string | EntitySchema>) {
    const AppDataSource = new DataSource({
        type: 'sqlite',
        database: "kuc",
        entities,
        synchronize: true,
        logging: false,
    })

    return AppDataSource.initialize();
}