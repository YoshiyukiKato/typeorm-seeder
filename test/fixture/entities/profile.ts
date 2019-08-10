import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Person } from "./person";


@Entity()
export class Profile {
  @PrimaryColumn()
  id: number;

  @OneToOne(type => Person, person => person.profile)
  @JoinColumn()
  person: Person;
}
