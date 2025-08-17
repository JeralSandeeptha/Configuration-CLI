#!/usr/bin/env node
const { program } = require("commander");
const configureStorybook = require("../commands/configure-storybook");
const configureTailwind = require("../commands/configure-tailwind");

program
  .command("configure-tailwind")
  .description("Configure Tailwindcss to the current project")
  .action(configureTailwind);

  program
  .command("configure-storybook")
  .description("Configure Storybook in the current project")
  .action(configureStorybook);

program.parse(process.argv);