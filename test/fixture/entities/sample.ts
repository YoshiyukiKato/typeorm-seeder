import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Sample {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
