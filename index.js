const { createBareServer } = require("@tomphttp/bare-server-node");
const http = require("http");
const os = require("os");

const bare = createBareServer("/bare/");
const server = http.createServer();

server.on("request", (req, res) => {
  bare.routeRequest(req, res);
});

server.on("upgrade", (req, socket, head) => {
  bare.routeUpgrade(req, socket, head);
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${os.hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
