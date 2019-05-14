#! /usr/bin/env node
import program from "commander";
import { Seeder } from "./index";

program
  .arguments("<seedFile> path pattern to seed files")
  .option("-c, --config <config>", "specify ormconfig path")
  .option("--clear", "clear seed data")
  .action(async (seedFile, options) => {
    try {
      const seeder = await new Seeder().init(
        options.config || "ormconfig.json",
        process.cwd()
      );
      await seeder.applySeedByFiles([seedFile], options.clear);
      console.log("completed");
      process.exit(0);
    } catch (err) {
      console.log("failed");
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
