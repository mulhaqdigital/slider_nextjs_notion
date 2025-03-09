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

type NotionProperties = {
  title: {
    type: 'title';
    title: Array<{ plain_text: string }>;
    id: string;
  };
  description: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
    id: string;
  };
  author: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
    id: string;
  };
  link: {
    type: 'url';
    url: string | null;
    id: string;
  };
  image: {
    type: 'files';
    files: Array<{
      type: 'file' | 'external';
      file?: { url: string };
      external?: { url: string };
    }>;
    id: string;
  };
};

export async function getCards(): Promise<Card[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: databaseId!,
    });

    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const properties = page.properties as unknown as NotionProperties;

        return {
          id: page.id,
          title: properties.title.title[0]?.plain_text || '',
          description: properties.description.rich_text[0]?.plain_text || '',
          author: properties.author.rich_text[0]?.plain_text || '',
          link: properties.link.url || '',
          imageUrl: properties.image.files[0]?.file?.url || properties.image.files[0]?.external?.url || '',
        };
      });
  } catch (error: unknown) {
    console.error('Error fetching cards from Notion:', error);
    return [];
  }
} 