const fs = require("fs-extra");
const path = require("path");
const { execa } = require("execa");

module.exports = async function configurePercy() {
  console.log("🔧 Adding Percy...");
  try {

    // Install the dependencies
    const deps = ["@percy/cli", "@percy/storybook"];

    console.log("📦 Installing percy dependencies...");

    await execa("npm", ["install", ...deps], {
      stdio: "inherit",
    });
    console.log("✅ Percy dependencies installed");

    // Update package.json scripts
    console.log("📦 Adding Percy script...");

    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.percy =
      "percy storybook http://localhost:6006";

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log("✅ Percy script added to package.json");
    console.log("🚀 Now run: npm run percy");
  } catch (error) {
    console.error("❌ Failed to add Percy", error);
    process.exit(1);
  }
};
