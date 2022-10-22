import { DataSource, EntitySchema, MixedList } from "typeorm";
import { join } from 'path';

export async function createDatabase(entities: MixedList<Function | string | EntitySchema>) {
    const AppDataSource = new DataSource({
        type: 'sqlite',
        database: "db/kuc.fileStorage",
        entities,
        synchronize: false,
        logging: false,
        migrationsRun: true,
        migrationsTableName: 'migration',
        migrations: [join(__dirname, 'migration/*.ts')]
    })

    return AppDataSource.initialize();
}