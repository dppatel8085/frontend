import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "db.json");

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Vite middleware that exposes a REST-shaped mock API under /api.
 * Endpoints mirror a real backend so Axios usage stays production-like.
 */
export function mockApiPlugin() {
  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api")) {
          next();
          return;
        }

        const url = new URL(req.url, "http://localhost");
        const pathname = url.pathname.replace(/^\/api/, "") || "/";
        const method = (req.method ?? "GET").toUpperCase();

        try {
          const db = readDb();

          if (method === "POST" && pathname === "/auth/login") {
            const body = await readBody(req);
            const user = db.users.find(
              (item) =>
                item.email === body.email && item.password === body.password,
            );
            if (!user) {
              send(res, 401, { message: "Invalid email or password" });
              return;
            }
            send(res, 200, {
              token: `mock-token-${user.id}`,
              email: user.email,
              name: user.name,
            });
            return;
          }

          if (method === "GET" && pathname === "/visitors") {
            send(res, 200, db.visitors);
            return;
          }

          const visitorMatch = pathname.match(/^\/visitors\/([^/]+)$/);
          if (visitorMatch) {
            const id = decodeURIComponent(visitorMatch[1]);
            const index = db.visitors.findIndex((item) => item.id === id);

            if (method === "GET") {
              if (index === -1) {
                send(res, 404, { message: "Visitor not found" });
                return;
              }
              send(res, 200, db.visitors[index]);
              return;
            }

            if (method === "PUT") {
              if (index === -1) {
                send(res, 404, { message: "Visitor not found" });
                return;
              }
              const body = await readBody(req);
              db.visitors[index] = {
                ...db.visitors[index],
                ...body,
                id,
              };
              writeDb(db);
              send(res, 200, db.visitors[index]);
              return;
            }

            if (method === "DELETE") {
              if (index === -1) {
                send(res, 404, { message: "Visitor not found" });
                return;
              }
              const [removed] = db.visitors.splice(index, 1);
              writeDb(db);
              send(res, 200, removed);
              return;
            }
          }

          if (method === "POST" && pathname === "/visitors") {
            const body = await readBody(req);
            const visitor = {
              id: `v-${Date.now()}`,
              name: body.name ?? "",
              phone: body.phone ?? "",
              unit: body.unit ?? "",
              visitDate: body.visitDate ?? "",
              status: "Pending",
            };
            db.visitors.unshift(visitor);
            writeDb(db);
            send(res, 201, visitor);
            return;
          }

          const approveMatch = pathname.match(/^\/visitors\/([^/]+)\/approve$/);
          if (method === "PATCH" && approveMatch) {
            const id = decodeURIComponent(approveMatch[1]);
            const visitor = db.visitors.find((item) => item.id === id);
            if (!visitor) {
              send(res, 404, { message: "Visitor not found" });
              return;
            }
            visitor.status = "Approved";
            writeDb(db);
            send(res, 200, visitor);
            return;
          }

          const rejectMatch = pathname.match(/^\/visitors\/([^/]+)\/reject$/);
          if (method === "PATCH" && rejectMatch) {
            const id = decodeURIComponent(rejectMatch[1]);
            const visitor = db.visitors.find((item) => item.id === id);
            if (!visitor) {
              send(res, 404, { message: "Visitor not found" });
              return;
            }
            visitor.status = "Rejected";
            writeDb(db);
            send(res, 200, visitor);
            return;
          }

          send(res, 404, { message: `No route for ${method} ${pathname}` });
        } catch (error) {
          send(res, 500, {
            message: error instanceof Error ? error.message : "Server error",
          });
        }
      });
    },
  };
}
