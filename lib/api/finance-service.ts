import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';
import { BackendUrlEnum } from '../constants/backend-urls';

/**
 * Finance Overview DTO
 */
export interface FinanceOverviewDto {
  totalRevenue: number;
  totalRevenueChange: number;
  monthlyRecurringRevenue: number;
  mrrChange: number;
  currency: string;
  activeSubscriptions: number;
  activeSubscriptionsChange: number;
  trialSubscriptions: number;
  expiredSubscriptions: number;
  averageRevenuePerUser: number;
  arpuChange: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  transactionSuccessRate: number;
  failedPaymentsLast24h: number;
  failedAmountLast24h: number;
  revenueByPlan: Array<{
    planName: string;
    planCode: string;
    revenue: number;
    subscriberCount: number;
    percentage: number;
  }>;
  subscriptionsByStatus: {
    active: number;
    inactive: number;
    expired: number;
    trial: number;
    nonRenewing: number;
  };
}

/**
 * Revenue Trend DTO
 */
export interface RevenueTrendDto {
  date: string;
  dailyRevenue: number;
  cumulativeRevenue: number;
  mrr: number;
  transactionCount: number;
  successfulTransactionCount: number;
}

/**
 * Transaction Volume DTO
 */
export interface TransactionVolumeDto {
  channel: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  successRate: number;
}

/**
 * Top Revenue Plan DTO
 */
export interface TopRevenuePlanDto {
  planId: string;
  planName: string;
  planCode: string;
  subscriberCount: number;
  totalRevenue: number;
  averageRevenue: number;
  percentage: number;
}

/**
 * Recent Transaction DTO
 */
export interface RecentTransactionDto {
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  channel: string;
  status: string;
  reference: string;
  narration: string;
  createdAt: string;
  gatewayResponse?: string;
}

/**
 * Failed Payment DTO
 */
export interface FailedPaymentDto {
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  channel: string;
  reason: string;
  gatewayResponse: string;
  attemptedAt: string;
  canRetry: boolean;
}

/**
 * Subscription Expiring Soon DTO
 */
export interface SubscriptionExpiringSoonDto {
  subscriptionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  planCode: string;
  amount: number;
  expiryDate: string;
  daysUntilExpiry: number;
  status: string;
  autoRenew: boolean;
}

/**
 * Trial Conversion Funnel DTO
 */
export interface TrialConversionFunnelDto {
  totalTrialsStarted: number;
  activeTrials: number;
  expiredTrials: number;
  convertedToSubscription: number;
  conversionRate: number;
  averageDaysToConvert: number;
  stages: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Paginated Transaction List DTO
 */
export interface PaginatedTransactionListDto {
  transactions: RecentTransactionDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Finance service for fetching financial data
 */
export class FinanceService {
  /**
   * Get finance overview
   * GET /api/v1/admin/finance/overview
   */
  static async getFinanceOverview(): Promise<UriResponse<FinanceOverviewDto>> {
    const response: Awaited<AxiosResponse<UriResponse<FinanceOverviewDto>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/finance/overview`);
    return response.data;
  }

  /**
   * Get revenue trend
   * GET /api/v1/admin/finance/revenue-trend?days={days}
   */
  static async getRevenueTrend(days: number = 30): Promise<UriResponse<RevenueTrendDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<RevenueTrendDto[]>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/finance/revenue-trend?days=${days}`
      );
    return response.data;
  }

  /**
   * Get transaction volume by channel
   * GET /api/v1/admin/finance/transaction-volume
   */
  static async getTransactionVolume(): Promise<UriResponse<TransactionVolumeDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<TransactionVolumeDto[]>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/finance/transaction-volume`);
    return response.data;
  }

  /**
   * Get top revenue plans
   * GET /api/v1/admin/finance/top-revenue-plans?limit={limit}
   */
  static async getTopRevenuePlans(limit: number = 5): Promise<UriResponse<TopRevenuePlanDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<TopRevenuePlanDto[]>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/finance/top-revenue-plans?limit=${limit}`
      );
    return response.data;
  }

  /**
   * Get recent transactions
   * GET /api/v1/admin/finance/recent-transactions?limit={limit}
   */
  static async getRecentTransactions(
    limit: number = 10
  ): Promise<UriResponse<PaginatedTransactionListDto>> {
    const response: Awaited<AxiosResponse<UriResponse<PaginatedTransactionListDto>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/finance/recent-transactions?limit=${limit}`
      );
    return response.data;
  }

  /**
   * Get failed payments
   * GET /api/v1/admin/finance/failed-payments
   */
  static async getFailedPayments(): Promise<UriResponse<FailedPaymentDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<FailedPaymentDto[]>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/finance/failed-payments`);
    return response.data;
  }

  /**
   * Get subscriptions expiring soon
   * GET /api/v1/admin/finance/subscriptions-expiring-soon?days={days}
   */
  static async getSubscriptionsExpiringSoon(
    days: number = 7
  ): Promise<UriResponse<SubscriptionExpiringSoonDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<SubscriptionExpiringSoonDto[]>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/finance/subscriptions-expiring-soon?days=${days}`
      );
    return response.data;
  }

  /**
   * Get trial conversion funnel
   * GET /api/v1/admin/finance/trial-conversion-funnel
   */
  static async getTrialConversionFunnel(): Promise<UriResponse<TrialConversionFunnelDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TrialConversionFunnelDto>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/finance/trial-conversion-funnel`);
    return response.data;
  }
}
