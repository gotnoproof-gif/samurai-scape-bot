import http from "node:http";

export function startHealthServer(client) {
  const port = Number(process.env.PORT || 3000);

  const server = http.createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({
        ok: true,
        bot: client.user?.tag || "starting"
      }));
      return;
    }

    response.writeHead(200, { "content-type": "text/plain" });
    response.end("Ronin of Gielinor is awake.");
  });

  server.listen(port, () => {
    console.log(`Health server listening on port ${port}.`);
  });
}
