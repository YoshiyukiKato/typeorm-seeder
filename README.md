# typeorm-seeder
A simple extension library for [typeorm](https://github.com/typeorm/typeorm) to perform seeding.

```sh
$ npm install typeorm #install typeorm as a peer dependency
$ npm install --save-dev typeorm-seeder
$ $(npm bin)/typeorm-seeder [-c path/to/ormconfig] <path/to/seedfile>
```

```ts
// ./entities/sample.ts
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Sample {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
```

```ts
// ./seeds/sample.ts
import { Sample } from "../entities/sample";
import { ISeed } from "typeorm-seeder";

const samples = [
  {
    id: 1,
    name: "test",
  },
];

export default <ISeed>{
  Entity: Sample,
  seeds: samples,
};

```