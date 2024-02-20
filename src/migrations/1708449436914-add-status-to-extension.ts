import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToExtension1708449436914 implements MigrationInterface {
  name = 'AddStatusToExtension1708449436914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extension" ADD "statusId" integer`);
    await queryRunner.query(
      `ALTER TABLE "extension" ADD CONSTRAINT "UQ_1f47f63bb92a146508f6f47abd6" UNIQUE ("statusId")`
    );
    await queryRunner.query(
      `ALTER TABLE "extension" ADD CONSTRAINT "FK_1f47f63bb92a146508f6f47abd6" FOREIGN KEY ("statusId") REFERENCES "extension_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "FK_1f47f63bb92a146508f6f47abd6"`);
    await queryRunner.query(`ALTER TABLE "extension" DROP CONSTRAINT "UQ_1f47f63bb92a146508f6f47abd6"`);
    await queryRunner.query(`ALTER TABLE "extension" DROP COLUMN "statusId"`);
  }
}
