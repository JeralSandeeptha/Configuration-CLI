#!/usr/bin/env node
const { program } = require("commander");
const addStorybook = require("../commands/add-storybook");

program
  .command("add-storybook")
  .description("Configure Storybook in the current project")
  .action(addStorybook);

program.parse(process.argv);