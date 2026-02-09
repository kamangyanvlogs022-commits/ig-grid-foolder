const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

exports.handler = async () => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const data = response.results.map(page => {
      const files = page.properties.Media?.files || [];

      const media = files.map(file => {
        const isVideo = file.type === "file" && file.file?.url?.includes(".mp4");
        return {
          type: isVideo ? "video" : "image",
          url: file.file?.url || file.external?.url || "",
        };
      });

      return {
        title: page.properties.Name?.title?.[0]?.plain_text || "",
        date: page.properties["Publish Date"]?.date?.start || "",
        media,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};