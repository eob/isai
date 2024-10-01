import {
	getPattern,
	list,
	isai,
	isaiMatch,
	isaiMatches,
	isaiPattern,
	isaiPatterns,
	createisai,
	createisaiFromList,
} from "../../src";
import { fullPattern } from "../../src/pattern";
import { crawlers, browsers } from "../../fixtures";
let isaiInstance: any;

const AI_USER_AGENT_EXAMPLE =
	"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot";
const BROWSER_USER_AGENT_EXAMPLE =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91 Safari/537.36";

describe("isai", () => {
	describe("features", () => {
		test("pattern: pattern is a regex", () => {
			expect(getPattern()).toBeInstanceOf(RegExp);
		});
		test("list: list is an array", () => {
			expect(list).toBeInstanceOf(Array);
			expect(list.every((item) => typeof item === "string")).toBe(true);
		});
		test("isai: bot user agent string is recognised as an AI", () => {
			expect(isai(AI_USER_AGENT_EXAMPLE)).toBe(true);
		});
		test("isaiMatch: find pattern in bot user agent string", () => {
			expect(isaiMatch(AI_USER_AGENT_EXAMPLE)).toBe("openai.com/searchbot");
		});
		test("isaiMatches: find all patterns in bot user agent string", () => {
			expect(isaiMatches(AI_USER_AGENT_EXAMPLE)).toContain("openai.com/searchbot");
			expect(isaiMatches(AI_USER_AGENT_EXAMPLE)).toHaveLength(1);
		});
		test("isaiPattern: find first pattern in bot user agent string", () => {
			expect(isaiPattern(AI_USER_AGENT_EXAMPLE)).toBe(
				"openai.*bot",
			);
		});
		test("isaiPatterns: find all patterns in bot user agent string", () => {
			expect(isaiPatterns(AI_USER_AGENT_EXAMPLE)).toContain(
				"openai.*bot",
			);
			expect(isaiPatterns(AI_USER_AGENT_EXAMPLE)).toHaveLength(1);
		});
		test("createisai: create custom isai function with custom pattern", () => {
			const customisai = createisai(/bot/i);
			expect(customisai(AI_USER_AGENT_EXAMPLE)).toBe(true);
		});
		test("createisaiFromList: create custom isai function with custom pattern", () => {
			const ToRemoveStrings: string[] = [
				"openai.*bot"
			];
			const patternsToRemove: Set<string> = new Set(
				ToRemoveStrings.map(isaiMatches).flat(),
			);
			expect(patternsToRemove.size).toBeGreaterThan(0);
			const list2 = list.filter(
				(record: string): boolean => patternsToRemove.has(record) === false,
			);
			expect(list2.length).toBeLessThan(list.length);
			const isai2 = createisaiFromList(list2);
			const ua = "https://openai.com/gptbot"
			expect(isai(ua)).toBe(true);
			expect(isai2(ua)).toBe(false);
		});
		test.each([null, undefined, ""])(
			"all functions can accept %p",
			(value: string | null | undefined) => {
				expect(isai(value)).toBe(false);
				expect(isaiMatch(value)).toBe(null);
				expect(isaiMatches(value)).toEqual([]);
				expect(isaiPattern(value)).toBe(null);
				expect(isaiPatterns(value)).toEqual([]);
			},
		);
	});

	describe("regex fallback", () => {
		beforeAll(async () => {
			jest
				.spyOn(globalThis, "RegExp")
				.mockImplementation((pattern, flags): RegExp => {
					if ((pattern as string).includes?.("?<!")) {
						throw new Error("Invalid regex");
					}
					return new RegExp(pattern, flags);
				});
			const mdl = await import("../../index.js");
			if (!mdl) {
				throw new Error("Module not found");
			}
			isaiInstance = mdl.isai as ReturnType<typeof createisai>;
		});
		afterAll(() => {
			jest.restoreAllMocks();
		});
		test("fallback does not detect browser as bot", () => {
			expect(isaiInstance(BROWSER_USER_AGENT_EXAMPLE)).toBe(false);
		});
	});

	describe("fixtures", () => {
		test(`✔︎ ${crawlers.length} user agent string should be recognised as crawler`, () => {
			let successCount = 0;
			let misidentifiedStrings: string[] = [];
			crawlers.forEach((crawler) => {
				if (isai(crawler)) {
					successCount++;
				} else {
					misidentifiedStrings.push(crawler);
				}
			});
			expect(misidentifiedStrings).toEqual([]);
			expect(successCount).toBe(crawlers.length);
		});
		test(`✘ ${browsers.length} user agent string should not be recognised as an AI`, () => {
			let successCount = 0;
			let misidentifiedStrings: string[] = [];
			browsers.forEach((browser) => {
				if (isai(browser)) {
					misidentifiedStrings.push(browser);
				} else {
					successCount++;
				}
			});
			expect(misidentifiedStrings).toEqual([]);
			expect(successCount).toBe(browsers.length);
		});
	});

	describe("module interface", () => {
		test("interface is as expected", async () => {
			const types = Object.entries(await import("../../src/index")).map(
				([key, value]) => [key, value.constructor.name] as [string, string],
			);
			expect(types).toMatchSnapshot();
		});
		test("regular expressions exports are as expected", () => {
			expect(new RegExp(fullPattern, "i").toString()).toBe(
				getPattern()?.toString(),
			);
		});
	});
});
