const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

exports.handler = async () => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
      page_size: 12, // IG GRID LIMIT
    });

    const results = response.results.map(page => {
      return {
        url: page.properties.Image?.url || "",
        title: page.properties.Title?.title?.[0]?.plain_text || "",
        date: page.properties.Date?.date?.start || "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(results),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};