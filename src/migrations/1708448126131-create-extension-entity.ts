import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExtensionEntity1708448126131 implements MigrationInterface {
    name = 'CreateExtensionEntity1708448126131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."extension_sip_driver_enum" AS ENUM('SIP', 'PJSIP')`);
        await queryRunner.query(`CREATE TABLE "extension" ("id" SERIAL NOT NULL, "sip_driver" "public"."extension_sip_driver_enum" NOT NULL DEFAULT 'PJSIP', "extension_number" character varying(10) NOT NULL, CONSTRAINT "PK_e9e7da4f1cfc826aba870c20589" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "extension"`);
        await queryRunner.query(`DROP TYPE "public"."extension_sip_driver_enum"`);
    }

}
