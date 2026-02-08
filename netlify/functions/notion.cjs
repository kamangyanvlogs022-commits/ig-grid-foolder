// netlify/functions/notion.cjs

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async () => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Publish Date",
          direction: "ascending",
        },
      ],
      page_size: 12, // LIMIT TO 12 (IG GRID)
    });

    const items = response.results.map((page) => {
      return {
        title:
          page.properties.Name?.title?.[0]?.plain_text || "",
        url:
          page.properties.Link?.url || "",
        date:
          page.properties["Publish Date"]?.date?.start || "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};