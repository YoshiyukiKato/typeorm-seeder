import { Sample } from "../entities/sample";
import { ISeed } from "../../../src";

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
