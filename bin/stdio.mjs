#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const endpoint = process.env.PANTRY_BUDDY_MCP_URL
    || 'https://bonbrain-be-production.up.railway.app/mcp';
const token = process.env.PANTRY_BUDDY_TOKEN;

if (!token) {
    console.error('PANTRY_BUDDY_TOKEN is required.');
    process.exit(1);
}

const remoteClient = new Client(
    { name: 'pantry-buddy-mcp-stdio', version: '1.0.0' },
    { capabilities: {} },
);
const remoteTransport = new StreamableHTTPClientTransport(new URL(endpoint), {
    requestInit: {
        headers: { Authorization: `Bearer ${token}` },
    },
});
await remoteClient.connect(remoteTransport);

const localServer = new Server(
    { name: 'Pantry Buddy', version: '1.0.0' },
    { capabilities: { tools: {} } },
);
localServer.setRequestHandler(ListToolsRequestSchema, (request) => {
    return remoteClient.listTools(request.params);
});
localServer.setRequestHandler(CallToolRequestSchema, (request) => {
    return remoteClient.callTool(request.params);
});
await localServer.connect(new StdioServerTransport());
