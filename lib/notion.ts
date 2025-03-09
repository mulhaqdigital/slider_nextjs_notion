import { Client } from '@notionhq/client';

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

export async function getCards(): Promise<Card[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    const response = await notion.databases.query({
      database_id: databaseId!,
    });

    return response.results.map((page: any) => {
      // Safely access nested properties
      const getProperty = (prop: string) => {
        try {
          switch (prop) {
            case 'title':
              return page.properties.title?.title[0]?.plain_text;
            case 'description':
              return page.properties.description?.rich_text[0]?.plain_text;
            case 'author':
              return page.properties.author?.rich_text[0]?.plain_text;
            case 'link':
              return page.properties.link?.url;
            case 'image':
              const imageProperty = page.properties.image;
              if (!imageProperty) return '';
              
              // Handle different types of image attachments
              if (imageProperty.type === 'files') {
                const files = imageProperty.files;
                if (files && files.length > 0) {
                  const file = files[0];
                  // Handle both external and uploaded files
                  if (file.type === 'external') {
                    return file.external?.url || '';
                  } else if (file.type === 'file') {
                    return file.file?.url || '';
                  }
                }
              }
              return '';
            default:
              return '';
          }
        } catch (error) {
          console.error(`Error accessing ${prop} property:`, error);
          return '';
        }
      };

      return {
        id: page.id,
        title: getProperty('title'),
        description: getProperty('description'),
        author: getProperty('author'),
        link: getProperty('link'),
        imageUrl: getProperty('image'),
      };
    });
  } catch (error) {
    console.error('Error fetching cards from Notion:', error);
    return [];
  }
} 