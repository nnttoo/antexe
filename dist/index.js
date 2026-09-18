#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Haryanto 18 September 2026
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const util_1 = require("util");
async function run() {
    // Parse CLI arguments (e.g., --skip start,build,ui)
    const { values } = (0, util_1.parseArgs)({
        options: {
            skip: {
                type: 'string',
                short: 's',
            },
        },
        strict: false,
    });
    // Convert comma-separated string to array
    const excludedScripts = values.skip
        ? values.skip.split(',').map((item) => item.trim()).filter(Boolean)
        : [];
    // Read and parse package.json from the current working directory
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.existsSync(pkgPath)) {
        console.error('Error: package.json not found in the current working directory.');
        process.exit(1);
    }
    const rawData = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(rawData);
    const scriptMap = pkg.scripts || {};
    // Filter out scripts present in excludedScripts array
    const scripts = Object.keys(scriptMap).filter((script) => !excludedScripts.includes(script));
    if (scripts.length === 0) {
        console.log('No eligible scripts found in package.json.');
        process.exit(1);
    }
    // Format choices and attach script command as description
    const choices = scripts.map((script) => ({
        title: script,
        value: script,
        description: scriptMap[script] || '',
    }));
    // Prompt user to select script using arrow keys
    const response = await (0, prompts_1.default)({
        type: 'select',
        name: 'selectedScript',
        message: 'Select a script to run:',
        choices: choices,
        hint: 'Use arrow keys to navigate, press Enter to submit',
    });
    // Exit gracefully if user cancelled with Ctrl+C or ESC during prompt selection
    if (!response.selectedScript) {
        process.exit(0);
    }
    console.log(`\nExecuting: npm run ${response.selectedScript}\n`);
    // Spawn child process with inherited stdio stream
    const child = (0, child_process_1.spawn)('npm', ['run', response.selectedScript], {
        stdio: 'inherit',
        shell: true,
    });
    // Explicitly forward SIGINT (Ctrl + C) to child process to prevent terminal hang
    process.on('SIGINT', () => {
        child.kill('SIGINT');
        process.exit(0);
    });
}
run();
