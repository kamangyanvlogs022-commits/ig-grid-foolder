const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const items = response.results.map(page => ({
      title: page.properties?.Title?.title?.[0]?.plain_text || "",
      url: page.properties?.Image?.url || "",
      date: page.properties?.Date?.date?.start || ""
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};