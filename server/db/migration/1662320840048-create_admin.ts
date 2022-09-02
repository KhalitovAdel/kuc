import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdmin1662320840048 implements MigrationInterface {  
    private readonly adminEmail = 'timur@kucenko.ru';    
    private readonly adminPassword = 'nimda';    

    public async up(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`INSERT INTO user (email, password, role)
        VALUES ('${this.adminEmail}', '${this.adminPassword}', 'admin');`); 
    } 
    
    public async down(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`DELETE FROM user WHERE email='${this.adminEmail}';`); 
    } 
 }