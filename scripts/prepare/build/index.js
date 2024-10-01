import { readdir, readFile } from "node:fs/promises";
import { join } from "path";
import { parse } from "yaml";

/**
 * Return the values of objects in our YAML lists
 * @param {string} path File path
 * @returns {string[]}
 */
const readFixturesYaml = async (path) =>
	Object.values(parse((await readFile(path)).toString())).flat();

/**
 * Build the lists of user agent strings
 * @param {string} fixturesDirectory
 * @param {string} downloadedDirectory
 * @returns {Promise<{browsers: string[], crawlers: string[]}>
 */
export async function build({ fixturesDirectory, downloadedDirectory }) {
	return {
		browsers: Array.from(new Set(await browsers({ fixturesDirectory }))).sort(),
		crawlers: Array.from(
			new Set(await crawlers({ fixturesDirectory, downloadedDirectory })),
		).sort(),
	};
}

/**
 * List of web browsers user agent strings
 * @param {string} fixturesDirectory
 * @returns {string[]}
 */
async function browsers({ fixturesDirectory }) {
	return await readFixturesYaml(join(fixturesDirectory, "browsers.yml"));
}

/**
 * List of known crawlers user agent strings
 * @param {string} fixturesDirectory
 * @param {string} downloadedDirectory
 * @returns {string[]}
 */
async function crawlers({ fixturesDirectory, downloadedDirectory }) {
	const crawlers = await readFixturesYaml(
		join(fixturesDirectory, "crawlers.yml"),
	);
	return crawlers;
}
