import { Parent } from "../entities/parent";
import { Child } from "../entities/child";
import { ISeed } from "../../../src";

const parents = [
  {
    id: 1,
    children: [{ id: 1 }],
  },
];

export default <ISeed>{
  Entity: Parent,
  seeds: parents,
};
