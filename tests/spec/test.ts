import {
	getPattern,
	list,
	isai,
	isaiNaive,
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

const USER_AGENT_COMMON = [
	"Ada Chat Bot/1.0 Request Block",
	"Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse",
];
const USER_AGENT_GOTCHAS = [
	"Mozilla/5.0 (Linux; Android 10; CUBOT_X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
	"PS4Application libhttp/1.000 (PS4) CoreMedia libhttp/6.72 (PlayStation 4)",
];

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
			expect(isaiMatch(AI_USER_AGENT_EXAMPLE)).toBe("Google");
		});
		test("isaiMatches: find all patterns in bot user agent string", () => {
			expect(isaiMatches(AI_USER_AGENT_EXAMPLE)).toContain("Google");
			expect(isaiMatches(AI_USER_AGENT_EXAMPLE)).toHaveLength(4);
		});
		test("isaiPattern: find first pattern in bot user agent string", () => {
			expect(isaiPattern(AI_USER_AGENT_EXAMPLE)).toBe(
				"(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
			);
		});
		test("isaiPatterns: find all patterns in bot user agent string", () => {
			expect(isaiPatterns(AI_USER_AGENT_EXAMPLE)).toContain(
				"(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
			);
			expect(isaiPatterns(AI_USER_AGENT_EXAMPLE)).toHaveLength(4);
		});
		test("createisai: create custom isai function with custom pattern", () => {
			const customisai = createisai(/bot/i);
			expect(customisai(AI_USER_AGENT_EXAMPLE)).toBe(true);
		});
		test("createisaiFromList: create custom isai function with custom pattern", () => {
			const ChromeLighthouseUserAgentStrings: string[] = [
				"mozilla/5.0 (macintosh; intel mac os x 10_15_7) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 safari/537.36 chrome-lighthouse",
				"mozilla/5.0 (linux; android 7.0; moto g (4)) applewebkit/537.36 (khtml, like gecko) chrome/94.0.4590.2 mobile safari/537.36 chrome-lighthouse",
			];
			const patternsToRemove: Set<string> = new Set(
				ChromeLighthouseUserAgentStrings.map(isaiMatches).flat(),
			);
			const isai2 = createisaiFromList(
				list.filter(
					(record: string): boolean => patternsToRemove.has(record) === false,
				),
			);
			const [ua] = ChromeLighthouseUserAgentStrings;
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

	describe("isaiNaive", () => {
		test.each([75])(
			"a large number of user agent strings can be detected (>%s%)",
			(percent) => {
				const ratio =
					crawlers.filter((ua) => isaiNaive(ua)).length / crawlers.length;
				expect(ratio).toBeLessThan(1);
				expect(ratio).toBeGreaterThan(percent / 100);
			},
		);
		test.each([1])(
			"a small number of browsers is falsly detected as bots (<%s%)",
			(percent) => {
				const ratio =
					browsers.filter((ua) => isaiNaive(ua)).length / browsers.length;
				expect(ratio).toBeGreaterThan(0);
				expect(ratio).toBeLessThan(percent / 100);
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
		test("fallback regex detects commong crawlers", () => {
			USER_AGENT_COMMON.forEach((ua) => {
				if (!isaiInstance(ua)) {
					throw new Error(`Failed to detect ${ua} as bot`);
				}
			});
		});
		test("fallback detects gotchas as bots", () => {
			USER_AGENT_GOTCHAS.forEach((ua) => {
				if (!isaiInstance(ua)) {
					throw new Error(`Failed to detect ${ua} as bot (gotcha)`);
				}
			});
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
				getPattern().toString(),
			);
		});
	});
});
