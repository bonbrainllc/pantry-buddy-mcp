# Pantry Buddy MCP

<img src="assets/logo-400.png" alt="Pantry Buddy" width="96" align="right">

Ask your AI assistant about your kitchen: what's in stock, what expires soon, what to buy and what you spent on groceries.

Pantry Buddy turns your grocery receipts into a live pantry. This repository documents its **remote MCP server**. It holds no server code and no keys: the server is hosted by Bonbrain LLC.

| | |
| --- | --- |
| MCP URL | `https://mcp.bonbrain.com/mcp` |
| Transport | Streamable HTTP |
| Auth | OAuth 2.1 (authorization code + PKCE S256, dynamic client registration or client ID metadata document) |
| Registry | [`com.bonbrain/pantry-buddy`](https://registry.modelcontextprotocol.io/v0/servers?search=com.bonbrain/pantry-buddy) in the official MCP Registry |
| Docs | https://bonbrain.com/pantry-buddy/assistants |
| Privacy | https://bonbrain.com/privacy-policy |
| Support | info@bonbrain.com |

## What you need

- The Pantry Buddy iPhone app ([App Store](https://apps.apple.com/app/id6751549199)) and a Pantry Buddy account.
- An MCP client that supports remote servers with OAuth (Claude, ChatGPT, Cursor, VS Code, Cline, Grok, Le Chat and others).

## How connecting works

1. Add `https://mcp.bonbrain.com/mcp` as a remote MCP server (custom connector) in your assistant.
2. Your assistant opens the Pantry Buddy sign-in page.
3. In the app, open **Settings → AI connection → Connect an assistant** and type the 6-digit code it shows. The code is valid for 10 minutes and works once.
4. You are connected. The connection appears in the app under Settings → AI connection, where you can revoke it at any time.

Under the hood this is standard MCP authorization: the server answers `401` with `WWW-Authenticate: Bearer resource_metadata=…`, publishes [protected resource metadata](https://mcp.bonbrain.com/.well-known/oauth-protected-resource/mcp) and [authorization server metadata](https://mcp.bonbrain.com/.well-known/oauth-authorization-server), supports dynamic client registration (RFC 7591) and client ID metadata documents, requires PKCE S256 and returns `iss` on the authorization response (RFC 9207).

## Client setup

**Claude** (claude.ai, Desktop, mobile): Settings → Connectors → Add custom connector → URL `https://mcp.bonbrain.com/mcp`.

**Claude Code**

```bash
claude mcp add --transport http pantry-buddy https://mcp.bonbrain.com/mcp
```

**ChatGPT**: Settings → Apps → Create (developer mode) → MCP server URL `https://mcp.bonbrain.com/mcp`, authentication OAuth.

**Cursor / VS Code / Cline / Windsurf**: add the server by URL. Example [`mcp.json`](./mcp.json):

```json
{
  "mcpServers": {
    "pantry-buddy": { "url": "https://mcp.bonbrain.com/mcp" }
  }
}
```

The client starts the OAuth sign-in the first time it calls the server.

## Tools

All tools act only on the signed-in user's own pantry (or a shared pantry they belong to, via optional `pantryId`). No tool deletes data.

| Tool | What it does | Writes |
| --- | --- | --- |
| `list_pantry_items` | Pantry stock with quantities and expiry dates | |
| `list_expiring_items` | Items expiring in the next 7 days plus ones that expired in the last 3 (both adjustable) | |
| `add_pantry_item` | Add or restock an item | yes |
| `update_pantry_item` | Edit an item | yes |
| `mark_pantry_item_used` | "I finished the milk", "used half the spinach" | yes |
| `list_shopping_lists` | Shopping lists and their items | |
| `create_shopping_list` | New list | yes |
| `add_shopping_list_item` | Add a line to a list | yes |
| `add_to_shopping_list` | Add items by name, skipping what's already on the list | yes |
| `update_shopping_list_item` | Check off or edit a line | yes |
| `list_my_recipes` | Your cookbook | |
| `search_ingredients` | Ingredient catalog (ids for recipes) | |
| `create_my_recipe` | Save a recipe | yes |
| `update_my_recipe` | Edit a recipe | yes |
| `list_receipts` | Receipts scanned in the app: store, date, totals | |
| `get_receipt` | One receipt with its line items | |

Every tool carries `readOnlyHint`, `destructiveHint` and `openWorldHint` annotations. Receipts are scanned in the iPhone app; there is no image upload tool.

## Example prompts

- "What's in my pantry?"
- "What expires this week?"
- "Make a shopping list for tacos and skip what I already have."
- "Add 2 gallons of milk to my pantry."
- "Do I have eggs? If not, add them to my list."
- "How much did I spend at Kroger this month?"

## Privacy

Pantry Buddy reads and writes only the signed-in user's pantry, lists, recipes and receipts through Bonbrain's own API. It handles no health data and shows no sponsored content. Full policy: https://bonbrain.com/privacy-policy

## Not in this repository

Server or app source code, deployment configuration and credentials. This repository is documentation only; all rights reserved by Bonbrain LLC.
