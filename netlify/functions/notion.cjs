const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async function () {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        { property: "Publish Date", direction: "ascending" }
      ],
    });

    const data = response.results.map(page => {
      const files = page.properties["Files & media"]?.files || [];

      const media = files.map(f => {
        if (f.type === "external") {
          return { url: f.external.url };
        }
        if (f.type === "file") {
          return { url: f.file.url };
        }
        return null;
      }).filter(Boolean);

      return {
        title: page.properties.Name?.title?.[0]?.plain_text || "",
        media: media,
        date: page.properties["Publish Date"]?.date?.start || "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};