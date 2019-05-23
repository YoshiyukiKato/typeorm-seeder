import path from "path";
import {
  createConnection,
  ConnectionOptions,
  Connection,
  Repository,
  getMetadataArgsStorage,
} from "typeorm";
import glob from "fast-glob";
import { RelationMetadataArgs } from "typeorm/metadata-args/RelationMetadataArgs";

export interface ISeed {
  Entity: { new (): any };
  seeds: any[];
}

type TEntityRelations = { [key: string]: RelationMetadataArgs[] };

export class Seeder {
  private connection: Connection;
  private basePath: string;
  public async init(
    this: Seeder,
    configName?: string,
    basePath?: string
  ): Promise<Seeder> {
    const configPath = path.resolve(
      basePath || ".",
      configName || "ormconfig.json"
    );
    this.basePath = basePath;
    this.connection = await createConnection(<ConnectionOptions>(
      require(configPath)
    ));
    return this;
  }

  public async applySeeds(
    this: Seeder,
    { Entity, seeds }: ISeed,
    clear: boolean = false
  ): Promise<any[]> {
    const entityRelations = getMetadataArgsStorage()
      .relations.filter(({ target, relationType }) => {
        return target === Entity && relationType.match(/-to-many$/);
      })
      .reduce((acc: TEntityRelations, relation: RelationMetadataArgs) => {
        acc[relation["propertyName"]] = acc[relation["propertyName"]] || [];
        acc[relation["propertyName"]].push(relation);
        return acc;
      }, {});

    const relAppliedSeeds = await this.applyRelactions(
      seeds,
      entityRelations,
      clear
    );
    const repository = this.connection.getRepository(Entity);

    return await (clear
      ? this.removeSeeds(repository, relAppliedSeeds)
      : this.saveSeeds(repository, relAppliedSeeds));
  }

  public async applyRelactions(
    seeds: any[],
    entityRelations: TEntityRelations,
    clear: boolean
  ) {
    const relAppliedSeeds = [];
    for (const seed of seeds) {
      const relAppliedSeed = Object.assign({}, seed);
      for (const [key, val] of Object.entries(seed)) {
        if (!entityRelations[key]) continue;
        for (const entityRelation of entityRelations[key]) {
          const ChildEntity = (<Function>entityRelation.type)();
          if (Array.isArray(val)) {
            relAppliedSeed[key] = await this.applySeeds(
              <ISeed>{
                Entity: ChildEntity,
                seeds: val,
              },
              clear
            );
          } else {
            relAppliedSeed[key] = (await this.applySeeds(
              <ISeed>{
                Entity: ChildEntity,
                seeds: [val],
              },
              clear
            ))[0];
          }
        }
      }
      relAppliedSeeds.push(relAppliedSeed);
    }
    return relAppliedSeeds;
  }

  async saveSeeds<Entity>(
    this: Seeder,
    repository: Repository<Entity>,
    seeds: any[]
  ) {
    const entities = repository.create(seeds);
    await repository.save(entities);
    console.info("Saved seeds: ", seeds);
    return entities;
  }

  async removeSeeds<Entity>(
    this: Seeder,
    repository: Repository<Entity>,
    seeds: any[]
  ) {
    const entities = repository.create(seeds);
    await repository.remove(entities);
    console.info("Removed seed: ", seeds);
    return entities;
  }

  public async loadSeed(this: Seeder, seedData: ISeed): Promise<void> {
    await this.applySeeds(seedData);
  }

  public async clearSeed(this: Seeder, seedData: ISeed): Promise<void> {
    await this.applySeeds(seedData, true);
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
    const absFilePatterns = filePatterns.map(filePattern =>
      path.resolve(this.basePath, filePattern)
    );
    const seedDataList = await this.getSeedDataByFiles(absFilePatterns);
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
