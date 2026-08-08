/*
 * YouTube Data API keys should normally be supplied at deploy time and
 * restricted to the production domain. The timer remains usable without a
 * key by falling back to the last verified publication date below.
 */
window.TIMER_CONFIG = Object.freeze({
    apiKey: 'AIzaSyD-sAf0Wiw7gEYybgMeh5zIZHRKOxNPZ1M',
    channelId: 'UCACwRQLU0Bq5yxijfnBPRfQ',
    fallbackPublishedAt: '2025-12-23T12:00:00Z'
});
