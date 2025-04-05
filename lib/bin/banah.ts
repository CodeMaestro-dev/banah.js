#!/usr/bin/env node

import { Command } from "commander";
import createProject from "../createProject";

const program = new Command();

program
  .version("1.0.0")
  .command("create <project-name>")
  .description("Create a new Node.js project")
  .action((projectName: string) => {
    createProject(projectName);
  });

program.parse(process.argv);
