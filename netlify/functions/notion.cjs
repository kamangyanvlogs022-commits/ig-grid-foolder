const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          property: "Publish Date",
          direction: "descending",
        },
      ],
    });

    const data = response.results.map(page => {
      const files = page.properties.Media?.files || [];

      const file = files[0];
      let url = "";

      if (file) {
        if (file.type === "file") {
          url = file.file.url;
        } else if (file.type === "external") {
          url = file.external.url;
        }
      }

      return {
        title: page.properties.Name?.title?.[0]?.plain_text || "",
        url,
        date: page.properties["Publish Date"]?.date?.start || "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
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