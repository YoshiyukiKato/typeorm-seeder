import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Parent } from "./parent";

@Entity()
export class Child {
  @PrimaryColumn()
  id: number;

  @ManyToOne(type => Parent, parent => parent.children)
  parent: Parent;
}
