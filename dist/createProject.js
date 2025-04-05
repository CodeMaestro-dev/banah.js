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
        const blueprintDir = path_1.default.join(__dirname, "./blueprint");
        // Copy TypeScript-compatible package.json
        // Not this is the TypeScript for ESM (ECMA Script) in Node.JS not CommonJS
        const packageJsonContent = `
{
  "name": "seventh-test",
  "version": "1.0.0",
  "description": "A TypeScript-based Node.js project scaffolded by Banah JS.",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.17.30",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
`;
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "package.json"), packageJsonContent);
        // Create TypeScript configuration file
        const tsconfigContent = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`;
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "tsconfig.json"), tsconfigContent);
        // Create .gitignore file
        const gitignoreContent = `
    # Node modules
    node_modules/

    # Logs
    logs
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # dotenv environment variable files
    .env

    # Compiled output
    dist/

    # Operating system files
    .DS_Store
    Thumbs.db
    `;
        fs_1.default.writeFileSync(path_1.default.join(projectPath, ".gitignore"), gitignoreContent);
        // Create README.md
        fs_1.default.writeFileSync(path_1.default.join(projectPath, "README.md"), `# ${projectName}\n\nA TypeScript-based Node.js project.`);
        // Create .env file
        fs_1.default.writeFileSync(path_1.default.join(projectPath, ".env"), `PORT=3000`);
        // Create src directory and a basic TypeScript entry point
        const srcDir = path_1.default.join(projectPath, "src");
        fs_1.default.mkdirSync(srcDir);
        const indexTsContent = `import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Banah!");
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`;
        fs_1.default.writeFileSync(path_1.default.join(srcDir, "index.ts"), indexTsContent);
        // Create a controller folder
        const controllerFolderPath = path_1.default.join(srcDir, "controller");
        fs_1.default.mkdirSync(controllerFolderPath);
        console.log(colors_cli_1.default.green("Controller folder created."));
        // Install dependencies
        process.chdir(projectPath);
        console.log(colors_cli_1.default.yellow("Installing dependencies..."));
        (0, child_process_1.execSync)("npm install && npm install -D typescript ts-node @types/node @types/express", { stdio: "inherit" });
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
