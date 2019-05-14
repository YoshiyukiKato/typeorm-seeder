import path from "path";
import {
  createConnection,
  ConnectionOptions,
  Connection,
  Repository,
} from "typeorm";
import glob from "fast-glob";

export interface ISeed {
  Entity: { new (): any };
  seeds: any[];
}

export class Seeder {
  private connection: Connection;
  public async init(
    this: Seeder,
    configName?: string,
    basePath?: string
  ): Promise<Seeder> {
    const configPath = path.resolve(
      basePath || ".",
      configName || "ormconfig.json"
    );
    this.connection = await createConnection(<ConnectionOptions>(
      require(configPath)
    ));
    return this;
  }

  public async applySeed(
    this: Seeder,
    { Entity, seeds }: ISeed,
    clear: boolean = false
  ): Promise<void> {
    const repository = this.connection.getRepository(Entity);
    for (const seed of seeds) {
      await (clear
        ? this.removeSeed(repository, seed)
        : this.saveSeed(repository, seed));
    }
  }

  async saveSeed<Entity>(
    this: Seeder,
    repository: Repository<Entity>,
    seed: any
  ) {
    const entity = repository.create(seed);
    await repository.save(entity);
    console.info("Saved seed: ", seed);
  }

  async removeSeed<Entity>(
    this: Seeder,
    repository: Repository<Entity>,
    seed: any
  ) {
    const entity = repository.create(seed);
    await repository.remove(entity);
    console.info("Removed seed: ", seed);
  }

  public async loadSeed(this: Seeder, seedData: ISeed): Promise<void> {
    await this.applySeed(seedData);
  }

  public async clearSeed(this: Seeder, seedData: ISeed): Promise<void> {
    await this.applySeed(seedData, true);
  }

  public async loadSeedByFiles(
    this: Seeder,
    filePatterns: string[]
  ): Promise<void> {
    await this.applySeedByFiles(filePatterns);
  }

  public async clearSeedByFiles(
    this: Seeder,
    filePatterns: string[]
  ): Promise<void> {
    await this.applySeedByFiles(filePatterns, true);
  }

  public async applySeedByFiles(
    this: Seeder,
    filePatterns: string[],
    clear: boolean = false
  ): Promise<void> {
    const seedDataList = await this.getSeedDataByFiles(filePatterns);
    for (const seedData of seedDataList) {
      if (clear) {
        await this.clearSeed(seedData);
      } else {
        await this.loadSeed(seedData);
      }
    }
  }

  public async getSeedDataByFiles(
    this: Seeder,
    filePatterns: string[]
  ): Promise<ISeed[]> {
    const seedFiles: string[] = await glob(filePatterns);
    const seedDataList: ISeed[] = seedFiles.map(seedFile => {
      const seedData = require(path.resolve(process.cwd(), seedFile));
      return seedData.default ? seedData.default : seedData;
    });
    return seedDataList;
  }
}
