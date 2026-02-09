const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        { property: "Publish Date", direction: "ascending" }
      ],
    });

    const data = response.results.map(page => {
      const files = page.properties["Files & media"]?.files || [];

      return {
        title: page.properties.Name?.title?.[0]?.plain_text || "",
        url: files.length > 0
          ? (files[0].type === "external"
              ? files[0].external.url
              : files[0].file.url)
          : "",
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