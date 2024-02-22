import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUniqueIndexInExtension1708642953756 implements MigrationInterface {
    name = 'UpdateUniqueIndexInExtension1708642953756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_85f0cb347b140f60af03a6c1f3"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_de903e4f1b134dee300a22cf82" ON "extension" ("extension_number") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_de903e4f1b134dee300a22cf82"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_85f0cb347b140f60af03a6c1f3" ON "extension" ("sip_driver", "extension_number") `);
    }

}
