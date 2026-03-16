import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SmartLeadClient } from '../client/index.js';
import type { MCPToolResponse } from '../types/config.js';
import {
  AddEmailAccountToCampaignRequestSchema,
  CreateEmailAccountRequestSchema,
  GetAllEmailAccountsRequestSchema,
  GetEmailAccountByIdRequestSchema,
  GetWarmupStatsRequestSchema,
  ListEmailAccountsPerCampaignRequestSchema,
  RemoveEmailAccountFromCampaignRequestSchema,
  UpdateEmailAccountRequestSchema,
  UpdateEmailAccountWarmupRequestSchema,
} from '../types.js';

export function registerEmailAccountTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  server.registerTool(
    'smartlead_get_all_email_accounts',
    {
      title: 'Get All Email Accounts',
      description: 'List all email accounts with optional pagination.',
      inputSchema: GetAllEmailAccountsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetAllEmailAccountsRequestSchema.parse(params);
        const result = await client.emailAccounts.getAllEmailAccounts(p);
        return formatSuccessResponse('Email accounts retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_create_email_account',
    {
      title: 'Create Email Account',
      description: 'Add a new email account with SMTP/IMAP configuration.',
      inputSchema: CreateEmailAccountRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = CreateEmailAccountRequestSchema.parse(params);
        const result = await client.emailAccounts.createEmailAccount(p);
        return formatSuccessResponse(`Email account created for ${p.from_email}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_email_account',
    {
      title: 'Update Email Account',
      description: 'Update an existing email account configuration.',
      inputSchema: UpdateEmailAccountRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateEmailAccountRequestSchema.parse(params);
        const { email_account_id, ...updateParams } = p;
        const result = await client.emailAccounts.updateEmailAccount(email_account_id, updateParams);
        return formatSuccessResponse('Email account updated', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_email_account_by_id',
    {
      title: 'Get Email Account by ID',
      description: 'Get full details for a specific email account.',
      inputSchema: GetEmailAccountByIdRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetEmailAccountByIdRequestSchema.parse(params);
        const result = await client.emailAccounts.getEmailAccountById(p.email_account_id);
        return formatSuccessResponse('Email account details retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_email_account_warmup',
    {
      title: 'Configure Email Warmup',
      description: 'Set warmup settings: enable/disable, volume, ramp-up, and reply rate.',
      inputSchema: UpdateEmailAccountWarmupRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateEmailAccountWarmupRequestSchema.parse(params);
        const { email_account_id, ...warmupParams } = p;
        const result = await client.emailAccounts.updateEmailAccountWarmup(email_account_id, warmupParams);
        return formatSuccessResponse(`Warmup ${warmupParams.warmup_enabled ? 'enabled' : 'disabled'} for account ${email_account_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_warmup_stats',
    {
      title: 'Get Warmup Stats',
      description: 'Get the last 7 days of warmup statistics for an email account.',
      inputSchema: GetWarmupStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetWarmupStatsRequestSchema.parse(params);
        const result = await client.emailAccounts.getWarmupStats(p.email_account_id);
        return formatSuccessResponse('Warmup stats retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_list_email_accounts_per_campaign',
    {
      title: 'List Email Accounts per Campaign',
      description: 'Get all email accounts assigned to a campaign.',
      inputSchema: ListEmailAccountsPerCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ListEmailAccountsPerCampaignRequestSchema.parse(params);
        const result = await client.emailAccounts.listEmailAccountsPerCampaign(p.campaign_id);
        return formatSuccessResponse('Campaign email accounts retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_add_email_account_to_campaign',
    {
      title: 'Add Email Account to Campaign',
      description: 'Assign an email account to a campaign for sending.',
      inputSchema: AddEmailAccountToCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = AddEmailAccountToCampaignRequestSchema.parse(params);
        const result = await client.emailAccounts.addEmailAccountToCampaign(p.campaign_id, p.email_account_id);
        return formatSuccessResponse(`Email account ${p.email_account_id} added to campaign ${p.campaign_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_remove_email_account_from_campaign',
    {
      title: 'Remove Email Account from Campaign',
      description: 'Remove an email account from a campaign.',
      inputSchema: RemoveEmailAccountFromCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = RemoveEmailAccountFromCampaignRequestSchema.parse(params);
        const result = await client.emailAccounts.removeEmailAccountFromCampaign(p.campaign_id, p.email_account_id);
        return formatSuccessResponse(`Email account ${p.email_account_id} removed from campaign ${p.campaign_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
