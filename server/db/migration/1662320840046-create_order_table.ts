import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1662320840046 implements MigrationInterface {    

    public async up(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "buildType" varchar CHECK( "buildType" IN ('flat','house') ) NOT NULL, "area" integer NOT NULL, "userId" integer NOT NULL, "fullName" varchar NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`); 
    } 
    
    public async down(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`DROP TABLE order`); 
    } 
 }