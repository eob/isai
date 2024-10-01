import patternsList from "./patterns.json";
import { fullPattern } from "./pattern";

let pattern: RegExp;
export function getPattern(): RegExp | null {
	if (pattern instanceof RegExp) {
		return pattern;
	}
	try {
		// Build this RegExp dynamically to avoid syntax errors in older engines.
		return new RegExp(fullPattern, "i");
	} catch (error) {
		return null;
	}
}

/**
 * A list of bot identifiers to be used in a regular expression against user agent strings.
 */
export const list: string[] = patternsList.map((pattern) => pattern.pattern);

/**
 * Check if the given user agent includes a bot pattern.
 */
export function isai(userAgent?: string | null): boolean {
	return Boolean(userAgent) && getPattern()?.test(userAgent) || false;
}

/**
 * Create a custom isai function with a custom pattern.
 */
export const createisai =
	(customPattern: RegExp): ((userAgent?: string | null) => boolean) =>
	(userAgent: string): boolean =>
		Boolean(userAgent) && customPattern.test(userAgent);

/**
 * Create a custom isai function with a custom pattern.
 */
export const createisaiFromList = (
	list: string[],
): ((userAgent: string) => boolean) => {
	const pattern = new RegExp(list.join("|"), "i");
	return (userAgent: string): boolean =>
		Boolean(userAgent) && pattern.test(userAgent);
};

/**
 * Find the first part of the user agent that matches a bot pattern.
 */
export const isaiMatch = (userAgent?: string | null): string | null =>
	userAgent?.match(getPattern())?.[0] ?? null;

/**
 * Find all parts of the user agent that match a bot pattern.
 */
export const isaiMatches = (userAgent?: string | null): string[] =>
	list
		.map((part) => userAgent?.match(new RegExp(part, "i"))?.[0])
		.filter(Boolean);

/**
 * Find the first bot pattern that match the given user agent.
 */
export const isaiPattern = (userAgent?: string | null): string | null =>
	userAgent
		? (list.find((pattern) => new RegExp(pattern, "i").test(userAgent)) ?? null)
		: null;

/**
 * Find all bot patterns that match the given user agent.
 */
export const isaiPatterns = (userAgent?: string | null): string[] =>
	userAgent
		? list.filter((pattern) => new RegExp(pattern, "i").test(userAgent))
		: [];
