# MCP Server for Metro Publisher

A server that exposes helpful Metro Publisher tools via a Model Context Protocol (MCP) server. Use it to query Metro Publisher locations, fetch location details, add locations, and export data for WordPress or other CMS workflows.
It also exposes helper tools to get a geoname id and latitude and longitude for a location.

Installation

```bash
npm install
```

Run locally

```bash
# Starts the demo MCP server on http://localhost:3000/mcp
npm run server:dev
```

Open inspector UI

```bash
# Launch the inspector tooling so you can interact with prompts & tools in a UI
npm run server:inspect
```

What the server exposes:

## Available Tools

### add_mp_location

Add a new Metro Publisher location.

- **Parameters:**
  - title (string, required) — Human-readable name of the location (e.g. "City Library").
  - urlname (string, required) — URL-safe slug used for the public location URL (no spaces; e.g. "city-library").
  - description (string, optional) — Short summary or tagline.
  - latitude (number, optional) & longitude (number, optional) — Coordinates; provide both to set `coords` for the location.
  - street (string, optional) — Street name.
  - streetnumber (string, optional) — Street number or unit.
  - pcode (string, optional) — Postal / ZIP code.
  - geoname_id (number, optional) — GeoNames ID (used to connect Metro Publisher to GeoNames records).
  - phone (string, optional) — Contact phone number.
  - website (string, optional) — Website URL.
  - email (string, optional) — Contact email address.
  - fax (string, optional) — Fax number (if applicable).
  - content (string, optional) — Longer HTML or text content for the location (the tool wraps this in a p tag when sending).

### get_mp_locations

List Metro Publisher locations (paginated).

- **Parameters:**
  - page: Page number for Pagination,

### get_mp_location_details

Get the details for a Metro Publisher location.

- **Parameters:**
  - uuid: UUID of the location in Metro Publisher,

### get_geoname_data

Get the geoname id, the longitude and the latitude for a location.

- **Parameters:**
  - location_name: Human-readable name of the location,

### get_nominatim_data

Get Latitude and Longitude for a location name from Nominatim.

- **Parameters:**
  - location_name: Human-readable name of the location,

## Available Prompts

### exportLocations — wrapper to fetch, collect and format locations into an export

### createLocationData — helper prompt for generating cclocation_data.json (used during manual workflows)

## Environment variables (.env)

Set these environment variables in your '.env' file:

- PORT — Optional. Port the demo server listens on. Default used by the code is `3000` when PORT is not set.
- MP_INSTANCE_ID — Metro Publisher instance id
- MP_API_KEY / MP_API_SECRET — API credentials for your Metro Publisher instance.
- GEONAME_USERNAME — GeoNames username used by `get_geoname_data` to get the geoname_id that is required to add locations to metropublisher. You can sign up for geonames.org here: https://www.geonames.org/login
