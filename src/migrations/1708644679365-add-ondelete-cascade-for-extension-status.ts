import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOndeleteCascadeForExtensionStatus1708644679365 implements MigrationInterface {
    name = 'AddOndeleteCascadeForExtensionStatus1708644679365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd"`);
        await queryRunner.query(`ALTER TABLE "extension" ADD CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd" FOREIGN KEY ("dataId") REFERENCES "extension_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd"`);
        await queryRunner.query(`ALTER TABLE "extension" ADD CONSTRAINT "FK_9f01a16ca29a1c0ead7f3cba8bd" FOREIGN KEY ("dataId") REFERENCES "extension_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
