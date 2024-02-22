import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDefaultExtensionStatus1708644246859 implements MigrationInterface {
    name = 'ChangeDefaultExtensionStatus1708644246859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."extension_status_state_enum" RENAME TO "extension_status_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."extension_status_state_enum" AS ENUM('available', 'busy', 'unavailable')`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" TYPE "public"."extension_status_state_enum" USING "state"::"text"::"public"."extension_status_state_enum"`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" SET DEFAULT 'unavailable'`);
        await queryRunner.query(`DROP TYPE "public"."extension_status_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."extension_status_state_enum_old" AS ENUM('available', 'busy')`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" TYPE "public"."extension_status_state_enum_old" USING "state"::"text"::"public"."extension_status_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "extension_status" ALTER COLUMN "state" SET DEFAULT 'available'`);
        await queryRunner.query(`DROP TYPE "public"."extension_status_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."extension_status_state_enum_old" RENAME TO "extension_status_state_enum"`);
    }

}
