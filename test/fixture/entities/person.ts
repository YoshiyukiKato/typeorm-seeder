import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile";


@Entity()
export class Person {
  @PrimaryColumn()
  id: number;

  @OneToOne(type => Profile, profile => profile.person)
  profile: Profile;
}
