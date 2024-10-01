# isai 🤖/👨‍🦰

[![](https://img.shields.io/npm/v/isai?style=flat-square)](https://www.npmjs.com/package/isai) [![](https://img.shields.io/circleci/build/github/eob/isai?style=flat-square)](https://circleci.com/gh/eob/isai) [![](https://img.shields.io/github/last-commit/eob/isai?style=flat-square)](https://github.com/eob/isai/graphs/commit-activity) [![](https://img.shields.io/npm/dt/isai?style=flat-square)](https://www.npmjs.com/package/isai) [![](https://data.jsdelivr.com/v1/package/npm/isai/badge)](https://www.jsdelivr.com/package/npm/isai)

[![](./page/isai.svg)](https://isai.js.org)

Identify AIs using the user agent string.

## Usage

Install

```sh
npm i isai
```

Straightforward usage

```ts
import { isai } from "isai";

// Request
isai(request.headers.get("User-Agent"));

// Nodejs HTTP
isai(request.getHeader("User-Agent"));

// ExpressJS
isai(req.get("user-agent"));

// Browser
isai(navigator.userAgent);

// User Agent string
isai(
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
); // true

isai(
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
); // false
```

Use JSDeliver CDN you can import to the browser directly

> See specific versions and instructions [https://www.jsdelivr.com/package/npm/isai](https://www.jsdelivr.com/package/npm/isai)

ESM

```html
<script type="module">
  import { isai } from "https://cdn.jsdelivr.net/npm/isai@5/+esm";
  isai(navigator.userAgent);
</script>
```

UMD

```html
<script src="https://cdn.jsdelivr.net/npm/isai@5"></script>
<script>
  // isai is now global
  isai(navigator.userAgent);
</script>
```

## Named imports

| import              | Type                             | Description                                                                  |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| isai                | _(string?): boolean_             | Check if the user agent is an AI                                             |


## FAW

### Why are AIs distinct from bots and crawlers?

AIs process information differently than web crawlers:

* The goal of a crawler is to build a web index, so web developers are incentivised to return **more** rather than **less**: more keywords, more re-phrasings, more elaborations.
* The goal of an AI is to answer acute questions, so web developers are incentivised to return **less** rather than **more**: short, specific sentences written in such a way that an LLM can make the most use of them.

### What does "isai" do?

Isai approximates whether the originator of a web request is an AI Bot. It does this by looking at the User Agent string.

### What doesn't "isai" do?

Isai does not provide a perfectly accurate prediction:

- Some companies, such as Google and Apple, use ambiguous User Agent strings, meaning that the `AI, not AI` decision is, at best, a guess.
- No company is required to divulge whether their bot is an AI, so false negatives are virtually guaranteed.

### Why would I want to identify an AI?

You may want to identify an AI if you wish to inject additional and/or different information into your web page for the AI to consume.

For example, you may wish to:

- Provide an overview of the key points of a page in such a way that would be odd for human consumption.
- Provide a slightly different set of information for the AI to build up context that it might not otherwise have.