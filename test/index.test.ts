import path from "path";
import assert from "power-assert";
import { getConnection, Repository, Connection } from "typeorm";
import { Seeder } from "../src";
import { Sample } from "./fixture/entities/sample";
import { Parent } from "./fixture/entities/parent";
import { Child } from "./fixture/entities/child";
import { Person } from "./fixture/entities/person";
import { Profile } from "./fixture/entities/profile";

var seeder: Seeder;
var connection: Connection;

describe("typeorm-seeder", () => {
  before(async () => {
    const configName = "ormconfig.ts";
    const basePath = path.resolve(__dirname, "./fixture");
    seeder = new Seeder();
    await seeder.init(configName, basePath);
    connection = getConnection("default");
  });

  describe("simple", () => {
    var repository: Repository<Sample>;
    before(() => {
      repository = connection.getRepository(Sample);
    });
    describe("load seed data", () => {
      it("loads data by seed files", async () => {
        await seeder.loadSeedByFiles(["./seeds/sample.ts"]);
        const seedData = await repository.findOneOrFail({ id: 1 });
        assert(seedData);
      });
    });

    describe("clear seed data", () => {
      it("clears data by seed files", async () => {
        await seeder.clearSeedByFiles(["./seeds/sample.ts"]);
        const seedData = await repository.findOne({ id: 1 });
        assert(!seedData);
      });
    });
  });

  describe("with one to one relation", () => {
    var personRepository: Repository<Person>;
    var profileRepository: Repository<Profile>;

    before(() => {
      personRepository = connection.getRepository(Person);
      profileRepository = connection.getRepository(Profile);
    });

    describe("load seed data", () => {
      it("loads data by seed files", async () => {
        await seeder.loadSeedByFiles(["./seeds/person.ts"]);
        const personSeedData = await personRepository.findOneOrFail({ id: 1 });
        const profileSeedData = await profileRepository.findOneOrFail({ id: 2 });
        const personProfileSeedData = await personRepository.findOneOrFail({ where : { id: 1 }, relations: ["profile"] });
        assert(personSeedData);
        assert(profileSeedData);
        assert(personProfileSeedData.profile);
      });
    });

    describe("clear seed data", () => {
      it("clears data by seed files", async () => {
        await seeder.clearSeedByFiles(["./seeds/person.ts"]);
        const personSeedData = await personRepository.findOne({ id: 1 });
        const profileSeedData = await profileRepository.findOne({ id: 2 });
        assert(!personSeedData);
        assert(!profileSeedData);
      });
    });
  })

  describe("with one to many relation", () => {
    var parentRepository: Repository<Parent>;
    var childRepository: Repository<Child>;
    before(() => {
      parentRepository = connection.getRepository(Parent);
      childRepository = connection.getRepository(Child);
    });

    describe("load seed data", () => {
      it("loads data by seed files", async () => {
        await seeder.loadSeedByFiles(["./seeds/parent.ts"]);
        const parentSeedData = await parentRepository.findOneOrFail({ id: 1 });
        const childSeedData = await childRepository.findOneOrFail({ id: 1 });
        assert(parentSeedData);
        assert(childSeedData);
      });
    });

    describe("clear seed data", () => {
      it("clears data by seed files", async () => {
        await seeder.clearSeedByFiles(["./seeds/parent.ts"]);
        const parentSeedData = await parentRepository.findOne({ id: 1 });
        const childSeedData = await childRepository.findOne({ id: 1 });
        assert(!parentSeedData);
        assert(!childSeedData);
      });
    });
  });
});
