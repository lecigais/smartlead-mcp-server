import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SmartLeadClient } from '../client/index.js';
import type { MCPToolResponse } from '../types/config.js';
import {
  CreateCampaignRequestSchema,
  DeleteCampaignRequestSchema,
  ExportLeadsCsvRequestSchema,
  FetchAllCampaignsUsingLeadIdRequestSchema,
  GetAnalyticsOverviewRequestSchema,
  GetCampaignAnalyticsByDateRequestSchema,
  GetCampaignAnalyticsRequestSchema,
  GetCampaignRequestSchema,
  GetCampaignSequenceRequestSchema,
  GetCampaignStatisticsRequestSchema,
  ListCampaignsRequestSchema,
  SaveCampaignSequenceRequestSchema,
  UpdateCampaignScheduleRequestSchema,
  UpdateCampaignSettingsRequestSchema,
  UpdateCampaignStatusRequestSchema,
} from '../types.js';

export function registerCampaignTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  server.registerTool(
    'smartlead_create_campaign',
    {
      title: 'Create Campaign',
      description: 'Create a new SmartLead campaign. Starts in DRAFTED status.',
      inputSchema: CreateCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = CreateCampaignRequestSchema.parse(params);
        const result = await client.campaigns.createCampaign(p);
        return formatSuccessResponse('Campaign created successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_campaign',
    {
      title: 'Get Campaign',
      description: 'Get complete details for a single campaign by ID.',
      inputSchema: GetCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetCampaignRequestSchema.parse(params);
        const result = await client.campaigns.getCampaign(p.campaign_id);
        return formatSuccessResponse('Campaign retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_list_campaigns',
    {
      title: 'List Campaigns',
      description: 'List all campaigns with optional client filtering and tags.',
      inputSchema: ListCampaignsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ListCampaignsRequestSchema.parse(params);
        const result = await client.campaigns.listCampaigns(p);
        return formatSuccessResponse('Campaigns listed', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_campaign_status',
    {
      title: 'Update Campaign Status',
      description: 'Change campaign status to ACTIVE, PAUSED, or STOPPED.',
      inputSchema: UpdateCampaignStatusRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateCampaignStatusRequestSchema.parse(params);
        const result = await client.campaigns.updateCampaignStatus(p.campaign_id, p.status);
        return formatSuccessResponse(`Campaign status changed to ${p.status}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_campaign_schedule',
    {
      title: 'Update Campaign Schedule',
      description: 'Set the sending schedule: timezone, days, hours, and sending limits.',
      inputSchema: UpdateCampaignScheduleRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateCampaignScheduleRequestSchema.parse(params);
        const { campaign_id, ...scheduleParams } = p;
        const result = await client.campaigns.updateCampaignSchedule(campaign_id, scheduleParams);
        return formatSuccessResponse('Campaign schedule updated', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_update_campaign_settings',
    {
      title: 'Update Campaign Settings',
      description: 'Update tracking, stop conditions, unsubscribe text, and other campaign settings.',
      inputSchema: UpdateCampaignSettingsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = UpdateCampaignSettingsRequestSchema.parse(params);
        const { campaign_id, ...settingsParams } = p;
        const result = await client.campaigns.updateCampaignSettings(campaign_id, settingsParams);
        return formatSuccessResponse('Campaign settings updated', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_campaign_sequence',
    {
      title: 'Get Campaign Sequence',
      description: 'Retrieve the email sequence configuration including all variants and delays.',
      inputSchema: GetCampaignSequenceRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetCampaignSequenceRequestSchema.parse(params);
        const result = await client.campaigns.getCampaignSequence(p.campaign_id);
        return formatSuccessResponse('Campaign sequence retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_save_campaign_sequence',
    {
      title: 'Save Campaign Sequence',
      description: 'Create or update the email sequence for a campaign with variants and delays.',
      inputSchema: SaveCampaignSequenceRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = SaveCampaignSequenceRequestSchema.parse(params);
        const result = await client.campaigns.saveCampaignSequence(p.campaign_id, p.sequences);
        return formatSuccessResponse('Campaign sequence saved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_delete_campaign',
    {
      title: 'Delete Campaign',
      description: 'Permanently delete a campaign and all associated data. Cannot be undone.',
      inputSchema: DeleteCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = DeleteCampaignRequestSchema.parse(params);
        const result = await client.campaigns.deleteCampaign(p.campaign_id);
        return formatSuccessResponse(`Campaign ${p.campaign_id} deleted`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_fetch_all_campaigns_using_lead_id',
    {
      title: 'Get Campaigns by Lead',
      description: 'Find all campaigns that contain a specific lead.',
      inputSchema: FetchAllCampaignsUsingLeadIdRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = FetchAllCampaignsUsingLeadIdRequestSchema.parse(params);
        const result = await client.campaigns.fetchAllCampaignsUsingLeadId(p.lead_id);
        return formatSuccessResponse('Campaigns for lead retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_campaign_analytics',
    {
      title: 'Get Campaign Analytics',
      description: 'Get top-level analytics overview for a campaign.',
      inputSchema: GetCampaignAnalyticsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetCampaignAnalyticsRequestSchema.parse(params);
        const result = await client.campaigns.getCampaignAnalytics(p.campaign_id);
        return formatSuccessResponse('Campaign analytics retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_campaign_analytics_by_date',
    {
      title: 'Get Campaign Analytics by Date',
      description: 'Get campaign analytics segmented by date range.',
      inputSchema: GetCampaignAnalyticsByDateRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetCampaignAnalyticsByDateRequestSchema.parse(params);
        const { campaign_id, ...dateParams } = p;
        const result = await client.campaigns.getCampaignAnalyticsByDate(campaign_id, dateParams);
        return formatSuccessResponse('Campaign analytics by date retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_campaign_statistics',
    {
      title: 'Get Campaign Statistics',
      description: 'Get performance statistics for a campaign.',
      inputSchema: GetCampaignStatisticsRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = GetCampaignStatisticsRequestSchema.parse(params);
        const result = await client.campaigns.getCampaignStatistics(p.campaign_id);
        return formatSuccessResponse('Campaign statistics retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_export_leads_csv',
    {
      title: 'Export Leads CSV',
      description: 'Export all campaign leads as a CSV file.',
      inputSchema: ExportLeadsCsvRequestSchema.shape,
    },
    async (params) => {
      try {
        const p = ExportLeadsCsvRequestSchema.parse(params);
        const result = await client.campaigns.exportLeadsCsv(p.campaign_id);
        return formatSuccessResponse('Leads exported as CSV', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  server.registerTool(
    'smartlead_get_analytics_overview',
    {
      title: 'Get Analytics Overview',
      description: 'Get aggregate analytics across all campaigns.',
      inputSchema: GetAnalyticsOverviewRequestSchema.shape,
    },
    async () => {
      try {
        const result = await client.campaigns.getAnalyticsOverview();
        return formatSuccessResponse('Analytics overview retrieved', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
