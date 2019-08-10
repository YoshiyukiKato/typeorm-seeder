import { Person } from "../entities/person";
import { Profile } from "../entities/profile";
import { ISeed } from "../../../src";

const persons = [
  {
    id: 1,
    profile: {
      id: 2
    }
  },
];

export default <ISeed>{
  Entity: Person,
  seeds: persons,
};
