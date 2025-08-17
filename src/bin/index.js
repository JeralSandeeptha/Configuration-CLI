#!/usr/bin/env node
const { program } = require("commander");
const addStorybook = require("../commands/add-storybook");
const addTailwind = require("../commands/configure-tailwind");

program
  .command("add-tailwind")
  .description("Configure Tailwindcss to the current project")
  .action(addTailwind);

  program
  .command("add-storybook")
  .description("Configure Storybook in the current project")
  .action(addStorybook);

program.parse(process.argv);