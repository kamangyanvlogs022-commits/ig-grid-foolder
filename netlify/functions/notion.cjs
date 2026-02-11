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

  const media = files.map(file =>
    file.type === "external"
      ? { url: file.external.url }
      : { url: file.file.url }
  );

  return {
    title: page.properties.Name?.title?.[0]?.plain_text || "",
    media: media, // ← ITO ANG IMPORTANT
    url: media.length ? media[0].url : "",
    date: page.properties["Publish Date"]?.date?.start || "",
  };
});