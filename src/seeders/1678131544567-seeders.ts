import { MigrationInterface, QueryRunner } from "typeorm";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import config from "config/config";

const farmUuid11 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid12 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid13 = Array(10).fill(null).map(() => faker.datatype.uuid())

const farmUuid21 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid22 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid23 = Array(10).fill(null).map(() => faker.datatype.uuid())

const farmUuid31 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid32 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid33 = Array(10).fill(null).map(() => faker.datatype.uuid())

const farmUuid41 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid42 = Array(10).fill(null).map(() => faker.datatype.uuid())
const farmUuid43 = Array(10).fill(null).map(() => faker.datatype.uuid())

export class SeederMigration1678131544567 implements MigrationInterface {
  name = "SeederMigration1678131544567"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPasswords = await Promise.all(
      ["password1", "password2", "password3", "password4"].map(
      password => this.hashPassword(password)
    ));

    await queryRunner.query(`
      INSERT INTO public."user" ("id", "email", "hashedPassword", "address", "coordinates")
      VALUES ('e166a71a-4b57-48f5-aba9-a1c0f1c2d92b', 'user1@gmail.com', '${hashedPasswords[0]}', '{ "countryCode": "US", "city": "Sparta", "addressLine": "45 Pleasant Ln" }', '{ "lat": "23.23", "lng": "24.24"}'),
      ('2d1929c2-0ad3-448e-ba71-6aa2e7762b1c', 'user2@gmail.com', '${hashedPasswords[1]}', '{ "countryCode": "US", "city": "Clarkston", "addressLine": "751 N Indian Creek Dr #290" }', '{ "lat": "56.21", "lng": "21.22"}'),
      ('1696a014-0800-474e-b003-50bd262965f0', 'user3@gmail.com', '${hashedPasswords[2]}', '{ "countryCode": "US", "city": "Hudsonville", "addressLine": "3896 Acadia Dr" }', '{ "lat": "22.87", "lng": "11.42"}'),
      ('3d93baaa-eb19-4a4f-9941-4675a44e3bba', 'user4@gmail.com', '${hashedPasswords[3]}', '{ "countryCode": "US", "city": "Pueblo", "addressLine": "1154 W De La Vista Ct" }', '{ "lat": "87.22", "lng": "11.13"}')
    `)

    await Promise.all([
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid11, "e166a71a-4b57-48f5-aba9-a1c0f1c2d92b")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid12, "e166a71a-4b57-48f5-aba9-a1c0f1c2d92b")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid13, "e166a71a-4b57-48f5-aba9-a1c0f1c2d92b")}
      `)
    ])


    await Promise.all([
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid21, "2d1929c2-0ad3-448e-ba71-6aa2e7762b1c")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid22, "2d1929c2-0ad3-448e-ba71-6aa2e7762b1c")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid23, "2d1929c2-0ad3-448e-ba71-6aa2e7762b1c")}
      `)
    ])

    await Promise.all([
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid31, "1696a014-0800-474e-b003-50bd262965f0")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid32, "1696a014-0800-474e-b003-50bd262965f0")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid33, "1696a014-0800-474e-b003-50bd262965f0")}
      `)
    ])

    await Promise.all([
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid41, "3d93baaa-eb19-4a4f-9941-4675a44e3bba")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid42, "3d93baaa-eb19-4a4f-9941-4675a44e3bba")}
      `),
      queryRunner.query(`
        INSERT INTO "farm" ("id", "userId", "name", "address", "coordinates", "size", "yield")
        VALUES ${this.generateFarmData(farmUuid43, "3d93baaa-eb19-4a4f-9941-4675a44e3bba")}
      `)
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      DELETE FROM "farm"
      WHERE "userId" IN (
        'e166a71a-4b57-48f5-aba9-a1c0f1c2d92b',
        '2d1929c2-0ad3-448e-ba71-6aa2e7762b1c',
        '1696a014-0800-474e-b003-50bd262965f0',
        '3d93baaa-eb19-4a4f-9941-4675a44e3bba'
      )
    `)

    await queryRunner.query(`
      DELETE FROM "user"
      WHERE id IN (
        'e166a71a-4b57-48f5-aba9-a1c0f1c2d92b',
        '2d1929c2-0ad3-448e-ba71-6aa2e7762b1c',
        '1696a014-0800-474e-b003-50bd262965f0',
        '3d93baaa-eb19-4a4f-9941-4675a44e3bba'
      );
    `)
  }

  private async hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(salt_rounds);
    return bcrypt.hash(password, salt);
  }

  private generateFarmData(uuid: string[], userId: string) {
    let values = "";

    for (let i = 0; i < uuid.length; i++) {
      const localValue = `('${uuid[i]}', '${userId}', '${faker.name.jobArea()}', '{ "countryCode": "US", "city": "${faker.name.jobTitle()}", "addressLine": "${faker.name.jobTitle()}" }', '{ "lat": "${faker.datatype.number()}", "lng": "${faker.datatype.number()}" }', ${faker.datatype.number()}, ${faker.datatype.number()})`
 
      if (i > 0) {
        values += `, ${localValue}`
      } else {
        values += `${localValue}`
      }
    }

    return values;
  }
}
