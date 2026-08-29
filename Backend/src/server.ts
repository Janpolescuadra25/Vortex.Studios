import express from "express";
import morgan from "morgan";
import { PrismaClient, Lane, ProductStatus } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT ?? 4000);

app.use(morgan("dev"));
app.use(express.json());

const LANES: string[] = ["ACCOUNTING", "AUTOMATION", "SOCIAL", "ECOMMERCE", "GAMES"];
const STATUSES: string[] = ["LIVE", "IN_DEVELOPMENT", "PLANNED", "CONCEPT"];

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vortex-backend", time: new Date().toISOString() });
});

app.get("/api/products", async (req, res, next) => {
  try {
    const status = req.query.status as string | undefined;
    const lane = req.query.lane as string | undefined;

    if (status !== undefined && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `invalid status '${status}'` });
    }
    if (lane !== undefined && !LANES.includes(lane)) {
      return res.status(400).json({ error: `invalid lane '${lane}'` });
    }

    const products = await prisma.product.findMany({
      where: {
        ...(status !== undefined ? { status: status as ProductStatus } : {}),
        ...(lane !== undefined ? { lane: lane as Lane } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });

    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "not found" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(PORT, () => {
  console.log(`vortex-backend listening on http://localhost:${PORT}`);
});
