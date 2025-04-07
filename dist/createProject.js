"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const colors_cli_1 = __importDefault(require("colors-cli"));
/**
 * Creates a new TypeScript-based Node.js project with a predefined structure.
 * @param projectName - The name of the project to create.
 */
function createProject(projectName) {
    try {
        // ✅ Validate name
        if (!projectName || !/^[a-zA-Z0-9_-]+$/.test(projectName)) {
            console.error(colors_cli_1.default.red("Invalid project name. Use only letters, numbers, underscores, or hyphens."));
            process.exit(1);
        }
        const projectPath = path_1.default.join(process.cwd(), projectName);
        if (fs_1.default.existsSync(projectPath)) {
            console.error(colors_cli_1.default.red(`Project "${projectName}" already exists.`));
            process.exit(1);
        }
        console.log(colors_cli_1.default.cyan(`Creating TypeScript project: ${projectName}...`));
        fs_1.default.mkdirSync(projectPath, { recursive: true });
        const blueprintDir = path_1.default.join(__dirname, "../lib/blueprint");
        // ✅ 1. Copy package.json with {{projectName}} replacement
        const packageJsonPath = path_1.default.join(blueprintDir, "package.json");
        if (fs_1.default.existsSync(packageJsonPath)) {
            const pkgTemplate = fs_1.default.readFileSync(packageJsonPath, "utf-8");
            const pkgContent = pkgTemplate.replace(/{{projectName}}/g, projectName);
            fs_1.default.writeFileSync(path_1.default.join(projectPath, "package.json"), pkgContent);
        }
        // ✅ 2. Copy tsconfig.json
        const tsconfigPath = path_1.default.join(blueprintDir, "tsconfig.json");
        if (fs_1.default.existsSync(tsconfigPath)) {
            const tsconfig = fs_1.default.readFileSync(tsconfigPath, "utf-8");
            fs_1.default.writeFileSync(path_1.default.join(projectPath, "tsconfig.json"), tsconfig);
        }
        // ✅ 3. Copy .gitignore
        const gitignorePath = path_1.default.join(blueprintDir, ".gitignore");
        if (fs_1.default.existsSync(gitignorePath)) {
            const gitignoreContent = fs_1.default.readFileSync(gitignorePath, "utf-8");
            fs_1.default.writeFileSync(path_1.default.join(projectPath, ".gitignore"), gitignoreContent);
        }
        // ✅ 4. Copy README.md (with project name replacement)
        const readmePath = path_1.default.join(blueprintDir, "README.md");
        if (fs_1.default.existsSync(readmePath)) {
            const readmeTemplate = fs_1.default.readFileSync(readmePath, "utf-8");
            const readmeContent = readmeTemplate.replace(/{{projectName}}/g, projectName);
            fs_1.default.writeFileSync(path_1.default.join(projectPath, "README.md"), readmeContent);
        }
        // ✅ 5. Copy .env file
        const envTemplatePath = path_1.default.join(blueprintDir, "env-template.txt");
        if (fs_1.default.existsSync(envTemplatePath)) {
            const envContent = fs_1.default.readFileSync(envTemplatePath, "utf-8");
            fs_1.default.writeFileSync(path_1.default.join(projectPath, ".env"), envContent);
        }
        // ✅ 6. Create src/ folder and copy index.ts
        const srcDir = path_1.default.join(projectPath, "src");
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const indexTSPath = path_1.default.join(blueprintDir, "index.ts");
        if (fs_1.default.existsSync(indexTSPath)) {
            const indexContent = fs_1.default.readFileSync(indexTSPath, "utf-8");
            fs_1.default.writeFileSync(path_1.default.join(srcDir, "index.ts"), indexContent);
        }
        // ✅ 7. Create src/controller folder
        const controllerDir = path_1.default.join(srcDir, "controller");
        fs_1.default.mkdirSync(controllerDir);
        console.log(colors_cli_1.default.green("Controller folder created."));
        // ✅ 8. Install dependencies
        process.chdir(projectPath);
        console.log(colors_cli_1.default.yellow("Installing dependencies..."));
        (0, child_process_1.execSync)("npm install", { stdio: "inherit" });
        console.log(colors_cli_1.default.green(`\nTypeScript project "${projectName}" created successfully.`));
        console.log(colors_cli_1.default.magenta(`\nNavigate to your project directory:\ncd ${projectName}`));
    }
    catch (error) {
        console.error(colors_cli_1.default.red("\nAn error occurred:"));
        console.error(colors_cli_1.default.red(error.message));
        process.exit(1);
    }
}
exports.default = createProject;
