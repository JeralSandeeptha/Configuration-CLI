#!/usr/bin/env node
const { program } = require("commander");
const configureStorybook = require("../commands/configure-storybook");
const configureTailwind = require("../commands/configure-tailwind");
const configurePercy = require("../commands/configure-percy");

program
  .command("configure-tailwind")
  .description("Configure Tailwindcss to the current project")
  .action(configureTailwind);

program
  .command("configure-storybook")
  .description("Configure Storybook in the current project")
  .action(configureStorybook);

program
  .command("configure-percy")
  .description("Configure Percy for the project")
  .action(configurePercy);

program.parse(process.argv);