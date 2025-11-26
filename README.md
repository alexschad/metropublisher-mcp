# metropublisher-mcp — Metro Publisher MCP demo & export tools

A server that exposes helpful Metro Publisher tools via a Model Context Protocol (MCP) server. Use it to query Metro Publisher locations, fetch location details, add locations, and export data for WordPress or other CMS workflows.

Quick goals

- Run the MCP server locally and use the Inspector to call tools interactively
- Export locations to JSON and an import-ready WordPress WXR XML file
- Add new locations (e.g. from `cclocation_data.json`) into the Metro Publisher API using the `add_mp_location` tool

Installation

```bash
npm install
```

Run locally (dev)

```bash
# Starts the demo MCP server on http://localhost:3000/mcp
npm run server:dev
```

Open inspector UI (recommended)

```bash
# Launch the inspector tooling so you can interact with prompts & tools in a UI
npm run server:inspect
```

What the server exposes:

tools:

- add_mp_location — create a new Metro Publisher location (title, urlname, coords, address, contact, content, ...)
- get_mp_locations — list locations (paginated)
- get_mp_location_details — fetch the full detail object for a location
- get_geoname_data — fetch GeoNames metadata
- get_nominatim_data — fetch Nominatim geocoding results

prompts:

- exportLocations — wrapper to fetch, collect and format locations into an export
- createLocationData — helper prompt for generating cclocation_data.json (used during manual workflows)

## Environment variables (.env)

Create a `.env` file in the repo root (do not commit it to source control). The MCP demo reads common variables via `dotenv`.

Common variables used by this demo:

- PORT — Optional. Port the demo server listens on. Default used by the code is `3000` when PORT is not set.
- MP_INSTANCE_ID — Metro Publisher instance id
- MP_API_KEY / MP_API_SECRET — API credentials for your Metro Publisher instance. Keep these secret and out of git.
- GEONAME_USERNAME — GeoNames username used by `get_geoname_data` to get the geoname_id that is required to add locations to metropublisher. You can sign up for geonames.org here: https://www.geonames.org/login
