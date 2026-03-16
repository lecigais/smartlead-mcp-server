import { BaseSmartLeadClient } from '../../client/base.js';
import type { SuccessResponse } from '../../types.js';

export class LeadClient extends BaseSmartLeadClient {
  /**
   * List all leads in a campaign.
   * GET /campaigns/{campaign_id}/leads
   */
  async listLeadsByCampaign(
    campaignId: number,
    params?: { offset?: number; limit?: number }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/leads`, { params }),
      'list leads by campaign'
    );
    return response.data;
  }

  /**
   * Fetch a lead by email address.
   * GET /leads/
   */
  async fetchLeadByEmail(email: string): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/', { params: { email } }),
      'fetch lead by email'
    );
    return response.data;
  }

  /**
   * Fetch all available lead categories.
   * GET /leads/fetch-categories
   */
  async fetchLeadCategories(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/fetch-categories'),
      'fetch lead categories'
    );
    return response.data;
  }

  /**
   * Add leads to a campaign.
   * POST /campaigns/{campaign_id}/leads
   */
  async addLeadsToCampaign(
    campaignId: number,
    leadList: Record<string, unknown>[],
    settings?: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const body: Record<string, unknown> = { lead_list: leadList };
    if (settings) {
      body.settings = settings;
    }
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads`, body),
      'add leads to campaign'
    );
    return response.data;
  }

  /**
   * Update a lead in a campaign.
   * POST /campaigns/{campaign_id}/leads/{lead_id}
   */
  async updateLead(
    campaignId: number,
    leadId: number,
    data: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}`, data),
      'update lead'
    );
    return response.data;
  }

  /**
   * Pause a lead in a campaign.
   * POST /campaigns/{campaign_id}/leads/{lead_id}/pause
   */
  async pauseLead(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/pause`),
      'pause lead'
    );
    return response.data;
  }

  /**
   * Resume a lead in a campaign.
   * POST /campaigns/{campaign_id}/leads/{lead_id}/resume
   */
  async resumeLead(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/resume`),
      'resume lead'
    );
    return response.data;
  }

  /**
   * Delete a lead from a campaign.
   * DELETE /campaigns/{campaign_id}/leads/{lead_id}
   */
  async deleteLead(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/leads/${leadId}`),
      'delete lead'
    );
    return response.data;
  }

  /**
   * Unsubscribe a lead from a specific campaign.
   * POST /campaigns/{campaign_id}/leads/{lead_id}/unsubscribe
   */
  async unsubscribeLeadFromCampaign(
    campaignId: number,
    leadId: number
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/unsubscribe`),
      'unsubscribe lead from campaign'
    );
    return response.data;
  }

  /**
   * Unsubscribe a lead globally from all campaigns.
   * POST /leads/{lead_id}/unsubscribe
   */
  async unsubscribeLeadGlobally(leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/leads/${leadId}/unsubscribe`),
      'unsubscribe lead globally'
    );
    return response.data;
  }

  /**
   * Add an email or domain to the global block list.
   * POST /leads/add-domain-block-list
   */
  async addToBlockList(email: string): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/leads/add-domain-block-list', { email }),
      'add to block list'
    );
    return response.data;
  }

  /**
   * Fetch message history for a lead in a campaign.
   * GET /campaigns/{campaign_id}/leads/{lead_id}/message-history
   */
  async fetchMessageHistory(
    campaignId: number,
    leadId: number
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/leads/${leadId}/message-history`),
      'fetch message history'
    );
    return response.data;
  }

  /**
   * Reply to a lead's email thread in a campaign.
   * POST /campaigns/{campaign_id}/reply-email-thread
   */
  async replyToLead(
    campaignId: number,
    replyData: { email_account_id: number; lead_id: number; email_body: string }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/reply-email-thread`, replyData),
      'reply to lead'
    );
    return response.data;
  }
}
