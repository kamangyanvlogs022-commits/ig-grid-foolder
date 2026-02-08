exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      {
        url: "https://i.imgur.com/4ZQZ4ZB.jpeg",
        title: "TEST IMAGE",
        date: "2026-02-06",
        carousel: false
      }
    ])
  };
};