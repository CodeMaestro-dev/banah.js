#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const createProject_1 = __importDefault(require("../createProject"));
const program = new commander_1.Command();
program
    .version("1.0.0")
    .command("create <project-name>")
    .description("Create a new Node.js project")
    .action((projectName) => {
    (0, createProject_1.default)(projectName);
});
program.parse(process.argv);
