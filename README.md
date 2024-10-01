# isai 🤖/👨‍🦰

[![](https://img.shields.io/npm/v/isai?style=flat-square)](https://www.npmjs.com/package/isai) [![](https://img.shields.io/circleci/build/github/eob/isai?style=flat-square)](https://circleci.com/gh/eob/isai) [![](https://img.shields.io/github/last-commit/eob/isai?style=flat-square)](https://github.com/eob/isai/graphs/commit-activity) [![](https://img.shields.io/npm/dt/isai?style=flat-square)](https://www.npmjs.com/package/isai) [![](https://data.jsdelivr.com/v1/package/npm/isai/badge)](https://www.jsdelivr.com/package/npm/isai)

[![](./page/isai.svg)](https://isai.js.org)

Identify bots, crawlers, and spiders using the user agent string.

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
  "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
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

## All named imports

| import              | Type                             | Description                                                                  |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| isai                | _(string?): boolean_             | Check if the user agent is a bot                                             |
| getPattern          | (): _RegExp_                     | The regular expression used to identify bots                                 |
| list                | _string[]_                       | List of all individual pattern parts                                         |


## Definitions

- **AI.** An automated process using the web on behalf of an LLM.

## Clarifications

### What does "isai" do?

### What doesn't "isai" do?

### Why would I want to identify an AI?

