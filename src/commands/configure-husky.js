const fs = require("fs-extra");
const path = require("path");
const { execa } = require("execa");
const inquirer = require("inquirer");

module.exports = async function configureHusky() {
  console.log("🔧 Adding Husky...");
  try {
    // Install the dependencies
    const deps = ["husky"];
    console.log("📦 Installing husky dependencies...");
    await execa("npm", ["install", "--save-dev", ...deps], {
      stdio: "inherit",
    });
    console.log("✅ Husky dependencies installed");

    // Initialize the Husky
    await execa("npx", ["husky", "init"]);

    // Configure pre push hook with user preference
    const prompt = inquirer.createPromptModule();

    const questions = [
      {
        type: "confirm",
        name: "PrePushHook",
        message: "Do you want to setup pre-push hook?",
        default: true,
      },
    ];
    const commitQuestions = [
      {
        type: "confirm",
        name: "CommitMessage",
        message: "Do you want to setup advance commit message style?",
        default: true,
      },
    ];

    // Ask user about Pre-Push
    prompt(questions)
      .then((res) => {
        console.log(res.PrePushHook);

        if (res.PrePushHook === true) {
          console.log("⚡ Setting up Pre-Push Hook...");
          const huskyDir = path.join(process.cwd(), ".husky");
          
          // Create the pre-push file
          const prePushContent = `npm run test`;
          fs.writeFile(path.join(huskyDir, "pre-push"), prePushContent, "utf8");
          console.log("✅ Pre-Push Hook setup successfully");

          // Ask user about advance Commit-Message
          prompt(commitQuestions)
            .then((res) => {
              console.log(res.CommitMessage);

              if(res.CommitMessage === true) {
                console.log("📦 Installing commitlint related dependencies...");
                const deps = ["@commitlint/cli", "@commitlint/config-conventional"];
                execa("npm", ["install", "--save-dev", ...deps]);
                console.log("📦 Related dependencies installed...");

                // Create commitlintrc.cjs file
                console.log("⚡ Setting up Commit-Message Hook...");
                const filePath = path.join(process.cwd(), ".commitlintrc.cjs");
                const content = `module.exports = {
                  extends: ['@commitlint/config-conventional']};`;
                fs.writeFile(filePath, content, "utf8");
                console.log("✅ .commitlintrc.cjs created successfully");

                // Create the commit structure
                const huskyDir = path.join(process.cwd(), ".husky");
                const commitMessageFileContent = `npx --no-install commitlint --edit $1`;
                fs.writeFile(path.join(huskyDir, "commit-msg"), commitMessageFileContent, "utf8");
                console.log("✅ Pre-Push Hook setup successfully");

                // Husky Successful Installation Message
                console.log("✅ Husky configured successfully");
              } else {
                console.log(" Commit-Message Hook setup cancled by user");
                console.log("✅ Husky configured successfully");
              }
            })
            .catch((error) => {
              console.log(error);
              console.log("❌ Commit-Message Hook Error");
            });
        } else {
          console.log(" Pre-Push Hook setup cancled by user");
          // Ask user about advance Commit-Message
          prompt(commitQuestions)
            .then((res) => {
              console.log(res.CommitMessage);

              if(res.CommitMessage === true) {
                console.log("📦 Installing commitlint related dependencies...");
                const deps = ["@commitlint/cli", "@commitlint/config-conventional"];
                execa("npm", ["install", "--save-dev", ...deps]);
                console.log("📦 Related dependencies installed...");

                // Create commitlintrc.cjs file
                console.log("⚡ Setting up Commit-Message Hook...");
                const filePath = path.join(process.cwd(), ".commitlintrc.cjs");
                const content = `module.exports = {
                  extends: ['@commitlint/config-conventional']};`;
                fs.writeFile(filePath, content, "utf8");
                console.log("✅ .commitlintrc.cjs created successfully");

                // Create the commit structure
                const huskyDir = path.join(process.cwd(), ".husky");
                const commitMessageFileContent = `npx --no-install commitlint --edit $1`;
                fs.writeFile(path.join(huskyDir, "commit-msg"), commitMessageFileContent, "utf8");
                console.log("✅ Pre-Push Hook setup successfully");

                // Husky Successful Installation Message
                console.log("✅ Husky configured successfully");
              } else {
                console.log(" Commit-Message Hook setup cancled by user");
                console.log("✅ Husky configured successfully");
              }
            })
            .catch((error) => {
              console.log(error);
              console.log("❌ Commit-Message Hook Error");
            });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("❌ Pre-Push Hook Error");
      });
  } catch (error) {
    console.error("❌ Failed to add Huksy", error);
    process.exit(1);
  }
};
