import glob from "glob";
import fs from "fs/promises"
import path from 'path';

// Import settings object from another file named "settings.js"
import {settings} from "./settings"

/**
 * Parses a file for dependencies and writes them to a "dependencies.txt" file.
 * @param {string} filePath - The file path to parse for dependencies.
 */

async function parseFile (filePath: string) {
    // Get the folder path of the file
    const folderPath = path.dirname(filePath)

    // Search for all files matching the glob patterns specified in "settings.globCodeFilesToParse"
    const files = (await Promise.all(settings.globCodeFilesToParse.map(globPattern => glob(path.join(folderPath, globPattern))))).flat()

    // Create a Set to store unique dependency names
    const setMatches = new Set();

    // Loop through each code file
    for (const file of files) {
        /** @type {String} */
        const fileText = await fs.readFile(file, "utf-8");

        // Search for all import statements that do not match the excluded patterns
        const matches = [...fileText.matchAll(settings.importMatchRegex)].map(el => el[1]);

        // Add each extracted dependency name to the Set
        for (const match of matches) {
            // Skip any names that have more than two path segments
            if (match.split("/").length > 2) continue;
            setMatches.add(match);
        }
    }

    // Write the unique dependency names to a "dependencies.txt" file
    await fs.writeFile(path.join(folderPath, "dependencies.txt"), [...setMatches].join(' '));
}

/**
 * Searches for all "package.json" files in the codebase and calls the "parseFile" function for each file.
 */
async function run () {
    const files = await glob(settings.packageJsonGlob)
    const total = files.length;
    let counter = 0;
    for (const file of files) {
        counter++;

        // Log progress to the console
        console.log(Math.floor(100 / total * counter));

        // Parse the file for dependencies and write them to a "dependencies.txt" file
		await parseFile(file);
	}
}

// Call the "run" function to start the script
run()
