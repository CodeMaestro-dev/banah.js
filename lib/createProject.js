const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const color = require("colors-cli");

function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Project ${projectName} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath);

  const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "A Node.js project scaffolded by Banah JS.",
    main: "index.js",
    scripts: {
      start: "node index.js",
      server: "nodemon index.js",
    },
    keywords: [],
    author: "",
    license: "MIT",
    dependencies: {
      express: "^4.17.1",
      cors: "^2.8.5",
      dotenv: "^10.0.0",
    },
    devDependencies: {
      nodemon: "^2.0.15",
    },
  };

  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  fs.writeFileSync(
    path.join(projectPath, ".gitignore"),
    `
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
    `
  );

  fs.writeFileSync(
    path.join(projectPath, "index.js"),
    `
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Banah Made this project');
    });

    app.listen(port, () => {
        console.log(\`Server is running on port \${port}\`);
    });
    `
  );

  const readmeContent = `
    # ${projectName}

    ## Description
    A Node.js project scaffolded by Banah JS.
    You could check the project up on Github, here's the link: <https://github.com/CodeMaestro-dev/banah.js/tree/main>
        
    ## Installation

    To install the project dependencies, run, however banah automatically installs the dependencies:

    \`\`\`
    npm install

    \`\`\`

    ## Usage

    To start the application, run:

    \`\`\`
    npm run start

    \`\`\`

    To run the application in development mode with automatic restarts:

    \`\`\`
    npm run server

    \`\`\`

    ## License
    This project is licensed under the MIT License.
    `;

  fs.writeFileSync(path.join(projectPath, "README.md"), readmeContent);

  process.chdir(projectPath);

  console.log();
  console.log(color.cyan(`Creating ${projectName}`));

  console.log();
  console.log(color.yellow("Installing dependencies..."));

  execSync("npm install", { stdio: "inherit" });

  console.log();
  console.log(color.green(`Project ${projectName} created successfully.`));

  console.log();
  console.log(color.magenta(`cd ./${projectName}`));
}

module.exports = createProject;
