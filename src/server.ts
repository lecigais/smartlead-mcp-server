import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { SmartLeadClient, SmartLeadError } from './client/index.js';
import {
  registerCampaignTools,
  registerLeadTools,
  registerEmailAccountTools,
} from './tools/index.js';
import type { MCPToolResponse } from './types/config.js';

/**
 * SmartLead MCP Server
 *
 * Exposes 37 documented SmartLead API endpoints as MCP tools.
 * Based on: https://helpcenter.smartlead.ai/en/articles/125-full-api-documentation
 */
export class SmartLeadMCPServer {
  private server: McpServer;
  private client: SmartLeadClient;

  constructor(
    apiKey: string,
    options?: {
      baseUrl?: string;
      timeout?: number;
      maxRetries?: number;
      retryDelay?: number;
      rateLimit?: number;
    }
  ) {
    this.server = new McpServer({
      name: 'smartlead-mcp-server',
      version: '2.0.0',
      description:
        'Unofficial SmartLead MCP Server - We are partners with SmartLead and love the product!',
    });

    this.client = new SmartLeadClient({
      apiKey,
      baseUrl: options?.baseUrl || 'https://server.smartlead.ai/api/v1',
      timeout: options?.timeout || 30000,
      maxRetries: options?.maxRetries || 3,
      retryDelay: options?.retryDelay || 1000,
      rateLimit: options?.rateLimit || 100,
    });

    this.setupServer();
  }

  private setupServer(): void {
    this.testConnection();
    this.registerAllTools(this.server);
    this.setupErrorHandlers();
  }

  private async testConnection(): Promise<void> {
    try {
      const result = await this.client.testConnection();
      if (result.success) {
        console.log('SmartLead API connection successful');
      } else {
        console.error('SmartLead API connection failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to test SmartLead API connection:', error);
    }
  }

  private registerAllTools(server: McpServer): void {
    const format = this.formatSuccessResponse.bind(this);
    const handle = this.handleError.bind(this);

    registerCampaignTools(server, this.client, format, handle);
    registerLeadTools(server, this.client, format, handle);
    registerEmailAccountTools(server, this.client, format, handle);

    console.log('All 37 SmartLead MCP tools registered');
  }

  private setupErrorHandlers(): void {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  private formatSuccessResponse(
    message: string,
    data?: unknown,
    summary?: string
  ): MCPToolResponse {
    const parts = [
      message,
      summary ? `\n${summary}` : '',
      data ? `\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`` : '',
    ]
      .filter(Boolean)
      .join('');

    return {
      content: [{ type: 'text' as const, text: parts }],
    };
  }

  private handleError(error: unknown): MCPToolResponse {
    console.error('SmartLead API Error:', error);

    let errorMessage = 'An unexpected error occurred';

    if (error instanceof SmartLeadError) {
      errorMessage = `SmartLead API Error: ${error.message} (${error.code}, status ${error.status})`;
    } else if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
    }

    return {
      content: [{ type: 'text' as const, text: errorMessage }],
    };
  }

  private createFreshMcpServer(): McpServer {
    const freshServer = new McpServer({
      name: 'smartlead-mcp-server',
      version: '2.0.0',
      description:
        'Unofficial SmartLead MCP Server - We are partners with SmartLead and love the product!',
    });

    this.registerAllTools(freshServer);
    return freshServer;
  }

  async connectHttp(port: number = 8083, host: string = '0.0.0.0'): Promise<void> {
    console.log(`Starting SmartLead MCP Server (HTTP) on http://${host}:${port}/mcp`);

    const self = this;

    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url!, `http://${req.headers.host}`);

      if (url.pathname === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
      }

      if (url.pathname === '/mcp' && (req.method === 'POST' || req.method === 'GET' || req.method === 'DELETE')) {
        const freshServer = self.createFreshMcpServer();
        const mcpTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        await freshServer.connect(mcpTransport);
        await mcpTransport.handleRequest(req, res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    httpServer.listen(port, host, () => {
      console.log(`SmartLead MCP Server (HTTP) running on http://${host}:${port}/mcp`);
    });
  }

  async connect(): Promise<void> {
    console.log('Starting SmartLead MCP Server v2.0.0...');
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('SmartLead MCP Server is running');
  }

  getServer(): McpServer {
    return this.server;
  }

  getClient(): SmartLeadClient {
    return this.client;
  }

  async close(): Promise<void> {
    await this.server.close();
    console.log('SmartLead MCP Server stopped');
  }
}
