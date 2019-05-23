import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Child } from "./child";

@Entity()
export class Parent {
  @PrimaryColumn()
  id: number;

  @OneToMany(type => Child, child => child.parent)
  children: Child[];
}
