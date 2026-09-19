# Pantry Buddy MCP

Remote MCP for Pantry Buddy. Personal pantry, shopping lists, cookbook recipes, and **saved** receipts.

This repository is the **public listing** for the remote MCP (docs, Cursor config, MIT license, optional stdio bridge). It is **not** the Pantry Buddy iOS app or backend. There are no production keys here.

## Connect

| | |
| --- | --- |
| MCP URL | https://bonbrain-be-production.up.railway.app/mcp |
| Transport | Streamable HTTP (`POST`) |
| Auth | `Authorization: Bearer pb_YOUR_KEY` |

Create the key in the Pantry Buddy iOS app: **Settings → AI connection**. The plaintext is shown once. Revoke or rotate from the same screen (rotate is `POST /api/auth/mcp-tokens/:id/rotate`). Pantry Buddy stores only a SHA-256 hash.

`pb_YOUR_KEY` is a placeholder. Paste the full key, including the `pb_` prefix, over the entire placeholder. Do not commit a real key.

## Cursor

Copy [`mcp.json`](./mcp.json) into `~/.cursor/mcp.json` or the project `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "pantry-buddy": {
      "url": "https://bonbrain-be-production.up.railway.app/mcp",
      "headers": {
        "Authorization": "Bearer pb_YOUR_KEY"
      }
    }
  }
}
```

Cursor Marketplace listing needs this public repo. The publish form still requires a Cursor sign-in; this repo is the GitHub half of that submit.

## Claude

**Claude Code** (remote HTTP + Bearer works):

```bash
claude mcp add --transport http pantry-buddy https://bonbrain-be-production.up.railway.app/mcp \
  --header "Authorization: Bearer pb_YOUR_KEY"
```

**Limitation:** Claude.ai / Cowork / Claude Desktop **Connectors** UI takes a URL plus optional OAuth client credentials and has no Bearer-header field, so v1 keys cannot be pasted there. Use Claude Code, or the stdio bridge below in `claude_desktop_config.json`.

## Grok

Grok supports remote MCP over Streaming HTTP.

- **App:** [grok.com/connectors](https://grok.com/connectors) → New Connector → Custom → URL `https://bonbrain-be-production.up.railway.app/mcp` and Bearer `pb_YOUR_KEY`.
- **CLI:** `grok mcp add --transport http pantry-buddy https://bonbrain-be-production.up.railway.app/mcp --header "Authorization: Bearer ${PANTRY_BUDDY_TOKEN}"`
- **API:** Remote MCP tool with `server_url` and `authorization` (https://docs.x.ai/developers/tools/remote-mcp).

## Stdio bridge

Only if the client cannot send a remote HTTP URL (some local desktop configs). Requires Node 20+:

```bash
PANTRY_BUDDY_TOKEN=pb_YOUR_KEY npx -y github:bonbrainllc/pantry-buddy-mcp
```

Or `npm run mcp:stdio` after a local clone. This process forwards stdio to the production `/mcp` URL. It does not embed secrets.

## Tools

Same user-scoped actions as the app (optional `pantryId` for a shared pantry you already belong to):

| Tool | What it does |
| --- | --- |
| `list_pantry_items` | List inventory |
| `add_pantry_item` | Add / restock an item |
| `update_pantry_item` | Update an item (integer `productId`) |
| `list_shopping_lists` | List lists |
| `create_shopping_list` | Create a list |
| `add_shopping_list_item` | Add a line |
| `update_shopping_list_item` | Check off / edit a line |
| `list_my_recipes` | Cookbook |
| `search_ingredients` | Catalog search for recipe `ingredientId` |
| `create_my_recipe` | Create a cookbook recipe |
| `update_my_recipe` | Update a cookbook recipe |
| `list_receipts` | Saved receipts (no image upload) |
| `get_receipt` | One receipt + line items (no image bytes) |

There is no receipt-camera / image-scan tool.

## Not in this repo

- Pantry Buddy iOS source
- Bonbrain backend source
- Railway env
- Real `pb_` keys
