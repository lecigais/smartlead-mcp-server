import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SmartLeadClient } from '../client/index.js';
import type { MCPToolResponse } from '../types/config.js';
import {
  AddLeadsToCampaignRequestSchema,
  AddToBlockListRequestSchema,
  DeleteLeadRequestSchema,
  FetchLeadByEmailRequestSchema,
  FetchLeadCategoriesRequestSchema,
  FetchMessageHistoryRequestSchema,
  ListLeadsByCampaignRequestSchema,
  PauseLeadRequestSchema,
  ReplyToLeadRequestSchema,
  ResumeLeadRequestSchema,
  UnsubscribeLeadFromCampaignRequestSchema,
  UnsubscribeLeadGloballyRequestSchema,
  UpdateLeadRequestSchema,
} from '../types.js';

export function registerLeadTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  server.registerTool(
    'smartlead_list_leads_by_campaign',
    {
      title: 'List Leads by Campaign',
      description: 'Retrieve leads in a campaign with pagination.',
      inputSchema: ListLeadsByCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ListLeadsByCampaignRequestSchema.parse(params);
        const { campaign_id, ...queryParams } = p;
        const result = await client.leads.listLeadsByCampaign(campaign_id, queryParams);
        return formatSuccessResponse('Leads retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_fetch_lead_by_email',
    {
      title: 'Fetch Lead by Email',
      description: 'Find a lead by their email address.',
      inputSchema: FetchLeadByEmailRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = FetchLeadByEmailRequestSchema.parse(params);
        const result = await client.leads.fetchLeadByEmail(p.email);
        return formatSuccessResponse('Lead found', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_fetch_lead_categories',
    {
      title: 'Fetch Lead Categories',
      description: 'Retrieve all available lead category options.',
      inputSchema: FetchLeadCategoriesRequestSchema.shape,
    },
    async () => {
      try {
        const result = await client.leads.fetchLeadCategories();
        return formatSuccessResponse('Lead categories retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_add_leads_to_campaign',
    {
      title: 'Add Leads to Campaign',
      description: 'Add up to 400 leads to a campaign with optional import settings.',
      inputSchema: AddLeadsToCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = AddLeadsToCampaignRequestSchema.parse(params);
        const result = await client.leads.addLeadsToCampaign(p.campaign_id, p.lead_list, p.settings);
        return formatSuccessResponse(`Added ${p.lead_list.length} leads to campaign ${p.campaign_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_lead',
    {
      title: 'Update Lead',
      description: 'Update a lead\'s information within a campaign.',
      inputSchema: UpdateLeadRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateLeadRequestSchema.parse(params);
        const { campaign_id, lead_id, ...data } = p;
        const result = await client.leads.updateLead(campaign_id, lead_id, data);
        return formatSuccessResponse('Lead updated', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_pause_lead',
    {
      title: 'Pause Lead',
      description: 'Temporarily halt email sending to a lead in a campaign.',
      inputSchema: PauseLeadRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = PauseLeadRequestSchema.parse(params);
        const result = await client.leads.pauseLead(p.campaign_id, p.lead_id);
        return formatSuccessResponse(`Lead ${p.lead_id} paused`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_resume_lead',
    {
      title: 'Resume Lead',
      description: 'Resume email sending to a paused lead.',
      inputSchema: ResumeLeadRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ResumeLeadRequestSchema.parse(params);
        const result = await client.leads.resumeLead(p.campaign_id, p.lead_id);
        return formatSuccessResponse(`Lead ${p.lead_id} resumed`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_delete_lead',
    {
      title: 'Delete Lead',
      description: 'Remove a lead from a campaign permanently.',
      inputSchema: DeleteLeadRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = DeleteLeadRequestSchema.parse(params);
        const result = await client.leads.deleteLead(p.campaign_id, p.lead_id);
        return formatSuccessResponse(`Lead ${p.lead_id} deleted from campaign`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_unsubscribe_lead_from_campaign',
    {
      title: 'Unsubscribe Lead from Campaign',
      description: 'Unsubscribe a lead from a specific campaign.',
      inputSchema: UnsubscribeLeadFromCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UnsubscribeLeadFromCampaignRequestSchema.parse(params);
        const result = await client.leads.unsubscribeLeadFromCampaign(p.campaign_id, p.lead_id);
        return formatSuccessResponse(`Lead ${p.lead_id} unsubscribed from campaign`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_unsubscribe_lead_globally',
    {
      title: 'Unsubscribe Lead Globally',
      description: 'Unsubscribe a lead from all campaigns.',
      inputSchema: UnsubscribeLeadGloballyRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UnsubscribeLeadGloballyRequestSchema.parse(params);
        const result = await client.leads.unsubscribeLeadGlobally(p.lead_id);
        return formatSuccessResponse(`Lead ${p.lead_id} unsubscribed from all campaigns`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_add_to_block_list',
    {
      title: 'Add to Block List',
      description: 'Add an email or domain to the global block list.',
      inputSchema: AddToBlockListRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = AddToBlockListRequestSchema.parse(params);
        const result = await client.leads.addToBlockList(p.email);
        return formatSuccessResponse(`${p.email} added to block list`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_fetch_message_history',
    {
      title: 'Fetch Message History',
      description: 'Get the complete email exchange history for a lead in a campaign.',
      inputSchema: FetchMessageHistoryRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = FetchMessageHistoryRequestSchema.parse(params);
        const result = await client.leads.fetchMessageHistory(p.campaign_id, p.lead_id);
        return formatSuccessResponse('Message history retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_reply_to_lead',
    {
      title: 'Reply to Lead',
      description: 'Send a reply to a lead\'s email thread within a campaign.',
      inputSchema: ReplyToLeadRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ReplyToLeadRequestSchema.parse(params);
        const { campaign_id, ...replyData } = p;
        const result = await client.leads.replyToLead(campaign_id, replyData);
        return formatSuccessResponse('Reply sent', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
