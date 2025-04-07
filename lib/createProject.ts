import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import color from "colors-cli";

/**
 * Creates a new TypeScript-based Node.js project with a predefined structure.
 * @param projectName - The name of the project to create.
 */
function createProject(projectName: string): void {
  try {
    // ✅ Validate name
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

    console.log(color.cyan(`Creating TypeScript project: ${projectName}...`));
    fs.mkdirSync(projectPath, { recursive: true });

    const blueprintDir = path.join(__dirname, "../lib/blueprint");

    // ✅ 1. Copy package.json with {{projectName}} replacement
    const packageJsonPath = path.join(blueprintDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkgTemplate = fs.readFileSync(packageJsonPath, "utf-8");
      const pkgContent = pkgTemplate.replace(/{{projectName}}/g, projectName);
      fs.writeFileSync(path.join(projectPath, "package.json"), pkgContent);
    }

    // ✅ 2. Copy tsconfig.json
    const tsconfigPath = path.join(blueprintDir, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = fs.readFileSync(tsconfigPath, "utf-8");
      fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsconfig);
    }

    // ✅ 3. Copy .gitignore
    const gitignorePath = path.join(blueprintDir, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
      fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);
    }

    // ✅ 4. Copy README.md (with project name replacement)
    const readmePath = path.join(blueprintDir, "README.md");
    if (fs.existsSync(readmePath)) {
      const readmeTemplate = fs.readFileSync(readmePath, "utf-8");
      const readmeContent = readmeTemplate.replace(
        /{{projectName}}/g,
        projectName
      );
      fs.writeFileSync(path.join(projectPath, "README.md"), readmeContent);
    }

    // ✅ 5. Copy .env file
    const envTemplatePath = path.join(blueprintDir, "env-template.txt");
    if (fs.existsSync(envTemplatePath)) {
      const envContent = fs.readFileSync(envTemplatePath, "utf-8");
      fs.writeFileSync(path.join(projectPath, ".env"), envContent);
    }

    // ✅ 6. Create src/ folder and copy index.ts
    const srcDir = path.join(projectPath, "src");
    fs.mkdirSync(srcDir, { recursive: true });

    const indexTSPath = path.join(blueprintDir, "index.ts");
    if (fs.existsSync(indexTSPath)) {
      const indexContent = fs.readFileSync(indexTSPath, "utf-8");
      fs.writeFileSync(path.join(srcDir, "index.ts"), indexContent);
    }

    // ✅ 7. Create src/controller folder
    const controllerDir = path.join(srcDir, "controller");
    fs.mkdirSync(controllerDir);
    console.log(color.green("Controller folder created."));

    // ✅ 8. Install dependencies
    process.chdir(projectPath);
    console.log(color.yellow("Installing dependencies..."));
    execSync("npm install", { stdio: "inherit" });

    console.log(
      color.green(`\nTypeScript project "${projectName}" created successfully.`)
    );
    console.log(
      color.magenta(`\nNavigate to your project directory:\ncd ${projectName}`)
    );
  } catch (error) {
    console.error(color.red("\nAn error occurred:"));
    console.error(color.red((error as Error).message));
    process.exit(1);
  }
}

export default createProject;
