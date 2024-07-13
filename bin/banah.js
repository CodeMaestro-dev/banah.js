#!/usr/bin/env node

const { program } = require("commander");
const createProject = require("../lib/createProject");

program
  .version("1.0.0")
  .command("create <project-name>")
  .description("Create a new Node.js project")
  .action((projectName) => {
    createProject(projectName);
  });

program.parse(process.argv);
