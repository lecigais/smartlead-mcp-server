import { CampaignManagementClient } from '../modules/campaigns/client.js';
import { EmailAccountManagementClient } from '../modules/email-accounts/client.js';
import { LeadClient } from '../modules/leads/client.js';
import type { SmartLeadConfig } from '../types/config.js';
import { BaseSmartLeadClient } from './base.js';

/**
 * Main SmartLead API Client
 *
 * Unified client providing access to all documented SmartLead API endpoints
 * through modular sub-clients.
 */
export class SmartLeadClient extends BaseSmartLeadClient {
  public readonly campaigns: CampaignManagementClient;
  public readonly leads: LeadClient;
  public readonly emailAccounts: EmailAccountManagementClient;

  constructor(config: SmartLeadConfig) {
    super(config);
    this.campaigns = new CampaignManagementClient(config);
    this.leads = new LeadClient(config);
    this.emailAccounts = new EmailAccountManagementClient(config);
  }
}

export { CampaignManagementClient } from '../modules/campaigns/client.js';
export { EmailAccountManagementClient } from '../modules/email-accounts/client.js';
export { LeadClient } from '../modules/leads/client.js';
export { SmartLeadConfig } from '../types/config.js';
export { BaseSmartLeadClient, SmartLeadError } from './base.js';
