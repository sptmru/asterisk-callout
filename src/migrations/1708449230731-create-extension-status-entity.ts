import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExtensionStatusEntity1708449230731 implements MigrationInterface {
    name = 'CreateExtensionStatusEntity1708449230731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."extension_status_status_enum" AS ENUM('available', 'busy')`);
        await queryRunner.query(`CREATE TABLE "extension_status" ("id" SERIAL NOT NULL, "status" "public"."extension_status_status_enum" NOT NULL DEFAULT 'available', CONSTRAINT "PK_53112d6352d32408a7deafde572" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "extension_status"`);
        await queryRunner.query(`DROP TYPE "public"."extension_status_status_enum"`);
    }

}
