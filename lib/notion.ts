import { Client } from '@notionhq/client';
import { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

if (!process.env.NOTION_TOKEN) {
  throw new Error('Missing NOTION_TOKEN environment variable');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('Missing NOTION_DATABASE_ID environment variable');
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export interface Card {
  id: string;
  title: string;
  description: string;
  author: string;
  link: string;
  imageUrl: string;
}

interface NotionProperty {
  type: string;
  url?: string | null;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  files?: Array<{ type: 'file' | 'external'; file?: { url: string }; external?: { url: string } }>;
}

interface NotionProperties {
  [key: string]: NotionProperty;
}

export async function getCards(): Promise<Card[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: databaseId!,
    });

    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const properties = page.properties as NotionProperties;

        const getTextContent = (prop: NotionProperty, type: 'title' | 'rich_text'): string => {
          if (prop.type !== type || !Array.isArray(prop[type])) return '';
          return prop[type][0]?.plain_text || '';
        };

        const getUrl = (prop: NotionProperty): string => {
          if (prop.type !== 'url') return '';
          return prop.url || '';
        };

        const getImageUrl = (prop: NotionProperty): string => {
          if (prop.type !== 'files' || !Array.isArray(prop.files) || !prop.files[0]) return '';
          const file = prop.files[0];
          return (file.type === 'file' ? file.file?.url : file.external?.url) || '';
        };

        return {
          id: page.id,
          title: getTextContent(properties.title, 'title'),
          description: getTextContent(properties.description, 'rich_text'),
          author: getTextContent(properties.author, 'rich_text'),
          link: getUrl(properties.link),
          imageUrl: getImageUrl(properties.image),
        };
      });
  } catch (error: unknown) {
    console.error('Error fetching cards from Notion:', error);
    return [];
  }
} 