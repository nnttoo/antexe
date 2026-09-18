#!/usr/bin/env node
// Haryanto 18 September 2026
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import { parseArgs } from 'util';

interface PackageJson {
    scripts?: Record<string, string>;
}

async function run(): Promise<void> {
    // Parse CLI arguments (e.g., --skip start,build,ui)
    const { values } = parseArgs({
        options: {
            skip: {
                type: 'string',
                short: 's',
            },
        },
        strict: false,
    });

    // Convert comma-separated string to array
    const excludedScripts: string[] = values.skip
        ? (values.skip as string).split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    // Read and parse package.json from the current working directory
    const pkgPath = path.resolve(process.cwd(), 'package.json');

    if (!fs.existsSync(pkgPath)) {
        console.error('Error: package.json not found in the current working directory.');
        process.exit(1);
    }

    const rawData = fs.readFileSync(pkgPath, 'utf8');
    const pkg: PackageJson = JSON.parse(rawData);

    const scriptMap = pkg.scripts || {};

    // Filter out scripts present in excludedScripts array
    const scripts = Object.keys(scriptMap).filter(
        (script) => !excludedScripts.includes(script)
    );

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
    const response = await prompts({
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
    const child = spawn('npm', ['run', response.selectedScript], {
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