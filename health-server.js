const http = require("http");
const { exec } = require("child_process");

const PORT = 18790;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET" && req.url === "/health") {
    exec(
      'docker ps --filter "name=openclaw" --format "{{.Status}}"',
      (err, stdout, stderr) => {
        const status = stdout.trim();
        const ok = !err && status.length > 0 && status.toLowerCase().startsWith("up");

        res.writeHead(200);
        res.end(
          JSON.stringify({
            ok,
            status: status || (err ? err.message : "container not found"),
            ts: new Date().toISOString(),
          })
        );
      }
    );
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`OpenClaw health server listening on http://0.0.0.0:${PORT}/health`);
});
