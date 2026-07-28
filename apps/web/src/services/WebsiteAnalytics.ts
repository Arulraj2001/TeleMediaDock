import {
  WebsiteAnalyticsEventSchema,
  type WebsiteEventType,
  type UtmParameters,
  type WebsiteAnalyticsEvent,
} from '@mediadock/validation';

export class WebsiteAnalyticsService {
  /**
   * Parse UTM parameters from URL search string
   */
  public parseUtmParameters(search: string): UtmParameters {
    const params = new URLSearchParams(search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    };
  }

  /**
   * Record a consent-aware website analytics event
   */
  public trackWebsiteEvent(
    event: WebsiteEventType,
    path: string,
    searchParams = ''
  ): WebsiteAnalyticsEvent | null {
    const utm = this.parseUtmParameters(searchParams);

    const candidate: WebsiteAnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      path,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
    };

    const parsed = WebsiteAnalyticsEventSchema.safeParse(candidate);
    if (parsed.success) {
      // Log or transmit website analytics payload
      return parsed.data;
    }
    return null;
  }
}

export const WebsiteAnalytics = new WebsiteAnalyticsService();
