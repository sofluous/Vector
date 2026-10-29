# Contract extraction verification ? 2026-10-28

`browser-results.json`: 64 checks per theme, all passing. `formula-*.png` are the retained Karakusa formula captures from the same run, not reference-variant comparison screenshots. The runner tests both new selectors and restores defaults before existing Karakusa checks. See [generator contracts](../../GENERATOR_CONTRACTS.md) for commands, API, and limitations.

Node suite: 32 passing tests; preserved prior baseline artifacts remain in their original audit folders. Browser launch required execution outside the sandbox because sandboxed GPU subprocess initialization failed. Download navigation and clipboard calls are intercepted; native OS permissions and editor interoperability are not certified. No performance optimization was introduced; the report retains measured synchronous render timing.
