const { spawnSync } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const npmExecPath = process.env.npm_execpath;

const checks = [
  ["build", ["run", "build"]],
  ["lint", ["run", "lint"]],
  ["test", ["run", "test:ci"]],
];

function runNpm(args) {
  const command = npmExecPath
    ? process.execPath
    : process.platform === "win32"
      ? "npm.cmd"
      : "npm";
  const commandArgs = npmExecPath ? [npmExecPath, ...args] : args;

  return spawnSync(command, commandArgs, {
    cwd: repoRoot,
    env: {
      ...process.env,
      PWD: repoRoot,
    },
    shell: false,
    stdio: "inherit",
  });
}

for (const [label, args] of checks) {
  const result = runNpm(args);

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log(`precommit: ${label} passed`);
}
