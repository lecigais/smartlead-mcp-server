import { BaseSmartLeadClient } from '../../client/base.js';
import type { SuccessResponse } from '../../types.js';

export class EmailAccountManagementClient extends BaseSmartLeadClient {
  /**
   * Get All Email Accounts
   * GET /email-accounts/
   */
  async getAllEmailAccounts(params?: {
    offset?: number;
    limit?: number;
  }): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/email-accounts/', { params }),
      'get all email accounts'
    );
    return response.data;
  }

  /**
   * Create Email Account
   * POST /email-accounts/save
   */
  async createEmailAccount(params: {
    from_name: string;
    from_email: string;
    username: string;
    password: string;
    smtp_host: string;
    smtp_port: number;
    smtp_port_type: string;
    imap_host: string;
    imap_port: number;
    max_email_per_day?: number;
    custom_tracking_url?: string;
    bcc?: string;
    signature?: string;
  }): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/email-accounts/save', params),
      'create email account'
    );
    return response.data;
  }

  /**
   * Update Email Account
   * POST /email-accounts/{email_account_id}
   */
  async updateEmailAccount(
    emailAccountId: number,
    params: {
      from_name?: string;
      from_email?: string;
      username?: string;
      password?: string;
      smtp_host?: string;
      smtp_port?: number;
      smtp_port_type?: string;
      imap_host?: string;
      imap_port?: number;
      max_email_per_day?: number;
      custom_tracking_url?: string;
      bcc?: string;
      signature?: string;
    }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}`, params),
      'update email account'
    );
    return response.data;
  }

  /**
   * Get Email Account By ID
   * GET /email-accounts/{email_account_id}/
   */
  async getEmailAccountById(emailAccountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}/`),
      'get email account by ID'
    );
    return response.data;
  }

  /**
   * Update Email Account Warmup
   * POST /email-accounts/{email_account_id}/warmup
   */
  async updateEmailAccountWarmup(
    emailAccountId: number,
    params: {
      warmup_enabled: boolean;
      total_warmup_per_day: number;
      daily_rampup: number;
      reply_rate_percentage: number;
    }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/warmup`, params),
      'update email account warmup'
    );
    return response.data;
  }

  /**
   * Get Warmup Stats By Email Account ID
   * GET /email-accounts/{email_account_id}/warmup-stats
   */
  async getWarmupStats(emailAccountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}/warmup-stats`),
      'get warmup stats'
    );
    return response.data;
  }

  /**
   * List Email Accounts Per Campaign
   * GET /campaigns/{campaign_id}/email-accounts
   */
  async listEmailAccountsPerCampaign(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'list email accounts per campaign'
    );
    return response.data;
  }

  /**
   * Add Email Account To Campaign
   * POST /campaigns/{campaign_id}/email-accounts
   */
  async addEmailAccountToCampaign(
    campaignId: number,
    emailAccountId: number
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/email-accounts`, {
          email_account_id: emailAccountId,
        }),
      'add email account to campaign'
    );
    return response.data;
  }

  /**
   * Remove Email Account From Campaign
   * DELETE /campaigns/{campaign_id}/email-accounts
   */
  async removeEmailAccountFromCampaign(
    campaignId: number,
    emailAccountId: number
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.delete(`/campaigns/${campaignId}/email-accounts`, {
          data: { email_account_id: emailAccountId },
        }),
      'remove email account from campaign'
    );
    return response.data;
  }
}
