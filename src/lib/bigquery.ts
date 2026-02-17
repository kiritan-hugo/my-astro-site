import { BigQuery } from '@google-cloud/bigquery';

export const bigquery = new BigQuery({
  projectId: import.meta.env.BIGQUERY_PROJECT_ID,
  credentials: {
    client_email: import.meta.env.BIGQUERY_CLIENT_EMAIL,
    private_key: import.meta.env.BIGQUERY_PRIVATE_KEY,
  },
  location: "asia-northeast1",
});