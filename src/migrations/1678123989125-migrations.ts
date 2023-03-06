import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1678123989125 implements MigrationInterface {
    name = 'migrations1678123989125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "address" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL`);
    }

}
