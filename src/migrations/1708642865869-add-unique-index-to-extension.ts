import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndexToExtension1708642865869 implements MigrationInterface {
    name = 'AddUniqueIndexToExtension1708642865869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_85f0cb347b140f60af03a6c1f3" ON "extension" ("sip_driver", "extension_number") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_85f0cb347b140f60af03a6c1f3"`);
    }

}
