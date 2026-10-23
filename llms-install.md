# Installing Pantry Buddy MCP (for AI agents such as Cline)

Pantry Buddy is a **remote** MCP server. There is nothing to clone, build or run locally.

1. Add this server to the MCP settings (for Cline: `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "pantry-buddy": {
      "type": "streamableHttp",
      "url": "https://mcp.bonbrain.com/mcp"
    }
  }
}
```

2. On the first call the server answers `401` and the client starts OAuth (PKCE, dynamic client registration). A browser page asks for a 6-digit code.
3. Ask the user to open the Pantry Buddy iPhone app → **Settings → AI connection → Connect an assistant** and type the code into that page. Do not ask the user to paste the code into the chat.
4. After sign-in, call `list_pantry_items` to confirm the connection.

No API keys or environment variables are needed. The user needs the Pantry Buddy iPhone app and an account. Support: info@bonbrain.com
