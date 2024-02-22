import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameExtensionState1708462151335 implements MigrationInterface {
    name = 'RenameExtensionState1708462151335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "FK_1f47f63bb92a146508f6f47abd6"`);
        await queryRunner.query(`ALTER TABLE "extension_status" RENAME COLUMN "status" TO "state"`);
        await queryRunner.query(`ALTER TYPE "public"."extension_status_status_enum" RENAME TO "extension_status_state_enum"`);
        await queryRunner.query(`ALTER TABLE "extension" RENAME COLUMN "statusId" TO "dataId"`);
        await queryRunner.query(`ALTER TABLE "extension" RENAME CONSTRAINT "UQ_1f47f63bb92a146508f6f47abd6" TO "UQ_9f01a16ca29a1c0ead7f3cba8bd"`);
        await queryRunner.query(`ALTER TABLE "extension" ADD CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd" FOREIGN KEY ("dataId") REFERENCES "extension_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd"`);
        await queryRunner.query(`ALTER TABLE "extension" RENAME CONSTRAINT "UQ_9f01a16ca29a1c0ead7f3cba8bd" TO "UQ_1f47f63bb92a146508f6f47abd6"`);
        await queryRunner.query(`ALTER TABLE "extension" RENAME COLUMN "dataId" TO "statusId"`);
        await queryRunner.query(`ALTER TYPE "public"."extension_status_state_enum" RENAME TO "extension_status_status_enum"`);
        await queryRunner.query(`ALTER TABLE "extension_status" RENAME COLUMN "state" TO "status"`);
        await queryRunner.query(`ALTER TABLE "extension" ADD CONSTRAINT "FK_1f47f63bb92a146508f6f47abd6" FOREIGN KEY ("statusId") REFERENCES "extension_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
