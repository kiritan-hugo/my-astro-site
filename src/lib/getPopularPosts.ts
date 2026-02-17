import { bigquery } from './bigquery';
import { getCollection } from 'astro:content';
import { initialPV } from '../data/initialPV';

// ローカル用のダミーデータ（必要なら調整）
const mockPopular = [
  { astro: null, pageviews: 0 },
];

export async function getPopularPosts(limit = 10) {
  // ⭐ ローカルでは BigQuery をスキップして高速化 ⭐
  if (import.meta.env.DEV) {
    console.log("DEVモード：BigQueryをスキップして高速化中");
    const posts = await getCollection('blog');

    // 全記事を初期PVだけでランキング
    const merged = posts.map((post) => {
      const url = `/${post.id}/`;
      const basePV = initialPV[url] ?? 0;

      return {
        astro: post,
        pageviews: basePV,
      };
    });

    return merged.sort((a, b) => b.pageviews - a.pageviews).slice(0, limit);
  }

  // ⭐ 本番では BigQuery を使う ⭐
  const query = `
    SELECT
      ep_location.value.string_value AS page_location,
      COUNT(*) AS pageviews
    FROM
      \`andes-life-analytics.analytics_423065429.events_*\`,
      UNNEST(event_params) AS ep_location
    WHERE
      event_name = "page_view"
      AND ep_location.key = "page_location"
    GROUP BY
      page_location
  `;

  const [rows] = await bigquery.query({ query });

  const pvMap = Object.fromEntries(
    rows.map((r) => [r.page_location, r.pageviews])
  );

  const posts = await getCollection('blog');

  const merged = posts.map((post) => {
    const url = `/${post.id}/`;

    const bigqueryPV =
      Object.entries(pvMap).find(([key]) => key.includes(url))?.[1] ?? 0;

    const basePV = initialPV[url] ?? 0;

    return {
      astro: post,
      pageviews: bigqueryPV + basePV,
    };
  });

  return merged.sort((a, b) => b.pageviews - a.pageviews).slice(0, limit);
}