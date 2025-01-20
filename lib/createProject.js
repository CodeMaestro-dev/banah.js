const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const color = require("colors-cli");

function createProject(projectName) {
  try {
    if (!projectName || !/^[a-zA-Z0-9_-]+$/.test(projectName)) {
      console.error(
        color.red(
          "Invalid project name. Use only letters, numbers, underscores, or hyphens."
        )
      );
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.error(color.red(`Project "${projectName}" already exists.`));
      process.exit(1);
    }

    console.log(color.cyan(`Creating project: ${projectName}...`));
    fs.mkdirSync(projectPath);

    const templatesDir = path.join(__dirname, "templates");

    // Copy package.json
    const packageJsonTemplate = fs.readFileSync(
      path.join(templatesDir, "package.json"),
      "utf8"
    );
    const packageJsonContent = packageJsonTemplate.replace(
      "{{projectName}}",
      projectName
    );
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      packageJsonContent
    );

    // Copy other template files
    const indexJsContent = fs.readFileSync(
      path.join(templatesDir, "index.js"),
      "utf8"
    );
    fs.writeFileSync(path.join(projectPath, "index.js"), indexJsContent);

    const gitignoreContent = `
    # Node modules
    node_modules/

    # Logs
    logs
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # dotenv environment variables file
    .env

    # Operating system files
    .DS_Store
    Thumbs.db
    `;

    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    const readmeTemplate = fs.readFileSync(
      path.join(templatesDir, "README.md"),
      "utf8"
    );

    fs.writeFileSync(path.join(projectPath, "README.md"), readmeTemplate);

    // Change directory and install dependencies
    process.chdir(projectPath);
    console.log(color.yellow("Installing dependencies..."));
    execSync("npm install", { stdio: "inherit" });

    console.log(
      color.green(`\nProject "${projectName}" created successfully.`)
    );
    console.log(
      color.magenta(`\nNavigate to your project directory:\ncd ${projectName}`)
    );
  } catch (error) {
    console.error(color.red("\nAn error occurred:"));
    console.error(color.red(error.message));
    process.exit(1);
  }
}

module.exports = createProject;
