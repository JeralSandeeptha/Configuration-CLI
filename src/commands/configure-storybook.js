const fs = require("fs-extra");
const path = require("path");
const { execa } = require("execa");

module.exports = async function configureStorybook() {
  console.log("🔧 Adding Storybook...");

  try {
    // 1️⃣ Install the dependencies
    const devDeps = [
      "@chromatic-com/storybook",
      "@storybook/addon-a11y",
      "@storybook/addon-docs",
      "@storybook/addon-vitest",
      "@storybook/addon-themes",
      "@storybook/nextjs-vite",
      "@storybook/addon-vitest",
      "@vitest/browser",
      "@vitest/coverage-v8",
      "eslint-plugin-storybook",
      "playwright",
      "storybook",
      "vitest",
    ];

    console.log("📦 Installing dev dependencies...");
    await execa("npm", ["install", "--save-dev", ...devDeps], {
      stdio: "inherit",
    });
    console.log("✅ Dev dependencies installed");

    // 2️⃣ Add Storybook scripts to package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.storybook =
      packageJson.scripts.storybook || "storybook dev -p 6006 --ci";
    packageJson.scripts["build-storybook"] =
      packageJson.scripts["build-storybook"] || "storybook build";

    console.log("✅ Added Storybook scripts to package.json");

    // ESLint config
    if (!packageJson.eslintConfig) {
      packageJson.eslintConfig = {
        extends: ["plugin:storybook/recommended"],
      };
      console.log("✅ Added eslintConfig section to package.json");
    } else if (
      !packageJson.eslintConfig.extends?.includes(
        "plugin:storybook/recommended"
      )
    ) {
      packageJson.eslintConfig.extends.push("plugin:storybook/recommended");
      console.log("✅ Updated eslintConfig with Storybook plugin");
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log("✅ Storybook scripts & eslintConfig set in package.json");

    // 3️⃣ Create .storybook folder
    const storybookDir = path.join(process.cwd(), ".storybook");
    await fs.ensureDir(storybookDir);

    // 4️⃣ Create main.ts
    const mainTsContent = `import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    '@storybook/addon-themes'
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  staticDirs: [
    "..\\\\public"
  ]
};

export default config;
`;
    await fs.writeFile(
      path.join(storybookDir, "main.ts"),
      mainTsContent,
      "utf8"
    );

    // 5️⃣ Create preview.tsx
    const previewTsxContent = `import type { Preview } from '@storybook/nextjs-vite';
import '../src/assets/globals.css';
import { SitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

import { withThemeByClassName } from "@storybook/addon-themes";

function baseComponentFactory(componentName, exportName, isEditing) {
  const components = new Map();

  const DEFAULT_EXPORT_NAME = 'Default';
  const component = components.get(componentName);

  if (component?.element) {
    return component.element(isEditing);
  }

  if (exportName && exportName !== DEFAULT_EXPORT_NAME) {
    return component[exportName];
  }

  return component?.Default || component?.default || component;
}

export const mockComponentFactory = function (componentName, exportName) {
  return baseComponentFactory(componentName, exportName, false);
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <SitecoreContext componentFactory={mockComponentFactory}>
        <Story />
      </SitecoreContext>
    ),
  ],
};

export default preview;
`;
    await fs.writeFile(
      path.join(storybookDir, "preview.tsx"),
      previewTsxContent,
      "utf8"
    );

    // 6️⃣ Create vitest.setup.ts
    const vitestSetupContent = `import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
`;
    await fs.writeFile(
      path.join(storybookDir, "vitest.setup.ts"),
      vitestSetupContent,
      "utf8"
    );

    // Create Shims file for Vitest
    const vitestShimPath = path.join(process.cwd(), "vitest.shims.d.ts");
    await fs.writeFile(
      vitestShimPath,
      '/// <reference types="@vitest/browser/providers/playwright" />\n',
      "utf8"
    );

    console.log("✅ Created vitest.shims.d.ts in project root");

    // 3️⃣ Create stories folder
    const storiesDir = path.join(process.cwd(), "/src/stories");
    await fs.ensureDir(storiesDir);

    console.log("✅ storybook folders and config files created successfully");

    console.log("✅ Storybook initialized successfully");
  } catch (error) {
    console.error("❌ Failed to add Storybook", error);
    process.exit(1);
  }
};
