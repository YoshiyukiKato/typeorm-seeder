import path from "path";
import assert from "power-assert";
import { getConnection, Repository } from "typeorm";
import { Seeder } from "../src";
import { Sample } from "./fixture/entities/sample";

var seeder: Seeder;
var repository: Repository<Sample>;

describe("typeorm-seeder", () => {
  before(async () => {
    const configName = "ormconfig.ts";
    const basePath = path.resolve(__dirname, "./fixture");
    seeder = new Seeder();
    await seeder.init(configName, basePath);
    repository = getConnection("default").getRepository(Sample);
  });

  describe("load seed data", () => {
    it("loads data by seed files", async () => {
      await seeder.loadSeedByFiles(["./fixture/seeds/*"]);
      const seedData = await repository.find({ id: 1 });
      assert(seedData);
    });
  });

  describe("clear seed data", () => {
    it("clears data by seed files", async () => {
      await seeder.clearSeedByFiles(["./fixture/seeds/*"]);
      const seedData = await repository.find({ id: 1 });
      assert(seedData, null);
    });
  });
});
