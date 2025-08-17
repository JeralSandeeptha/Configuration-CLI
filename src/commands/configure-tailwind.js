const fs = require("fs-extra");
const path = require("path");
const { execa } = require("execa");

module.exports = async function configureTailwind() {
  console.log("🔧 Adding TailwindCSS...");
  try {
    // 1️⃣ Install the dependencies
    const deps = ["tailwindcss", "@tailwindcss/postcss", "postcss"];

    console.log("📦 Installing tailwindcss dependencies...");
    console.log("📦 Using Postcss configurations...");

    await execa("npm", ["install", ...deps], {
      stdio: "inherit",
    });
    console.log("✅ Tailwindcss dependencies installed");

    console.info("📦 Adding configuration files for extra configurations");

    // Postcss file paths
    const sourceFile = path.join(__dirname, "../templates/tailwind/postcss.config.mjs");
    const destFile = path.join(process.cwd(), "postcss.config.mjs");

    // Copy the file to the root
    await fs.copy(sourceFile, destFile);
    console.log("✅ postcss.config.mjs copied to project root");

    // globals.css file paths
    const sourceFileCSS = path.join(__dirname, "../templates/tailwind/globals.css");
    const destFileCSS = path.join(process.cwd(), "src/assets/globals.css");

    // // Copy the file to the destination
    await fs.copy(sourceFileCSS, destFileCSS);
    console.log("✅ globals.css copied to assets");

    // Modifying _app.tsx
    console.log("✅ Modifying _app.tsx file");

    const appFilePath = path.join(process.cwd(), "src/pages/_app.tsx");
    if (!(await fs.pathExists(appFilePath))) {
      console.error("❌ _app.tsx not found at src/pages/_app.tsx");
      process.exit(1);
    }

    let content = await fs.readFile(appFilePath, "utf8");

    // Remove old import
    content = content.replace(/import\s+['"]assets\/main\.scss['"];?\n?/, "");

    // Add new imports at the top
    const newImports =
      "import '../assets/app.css';\nimport '../assets/globals.css';\n";
    content = newImports + content;

    await fs.writeFile(appFilePath, content, "utf8");
    console.log("✅ _app.tsx updated successfully!");

    console.log("✅ TailwindCSS added successfully");
  } catch (error) {
    console.error("❌ Failed to add TailwindCSS", error);
    process.exit(1);
  }
};
