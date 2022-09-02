import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1662320840047 implements MigrationInterface {    

    public async up(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" varchar CHECK( "role" IN ('admin','external_user') ) NOT NULL)`); 
    } 
    
    public async down(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`DROP TABLE user`); 
    } 
 }