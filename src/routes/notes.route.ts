import { Hono } from "hono";
import { ContextExtended } from "../types";

const notes = new Hono();

notes.get("/", async (ctx: ContextExtended) => {
  const db = ctx.env.DB;
  const notes = await db.prepare("SELECT * FROM note LIMIT 50").run();

  return Response.json(notes.results);
});

notes.get("/:id", async (ctx: ContextExtended) => {
  const id = ctx.req.path.split("/").slice(-1).join();
  const db = ctx.env.DB;
  const note = await db
    .prepare("SELECT * FROM note WHERE id = ?1")
    .bind(id)
    .first();

  return Response.json(note);
});

notes.post("/", async (ctx: ContextExtended) => {
  try {
    const { id, title, description } = await ctx.req.json();
    const db = ctx.env.DB;
    const response = await db
      .prepare(`INSERT INTO note (id, title, description) VALUES (?1, ?2, ?3)`)
      .bind(id, title, description)
      .run();

    return response.success
      ? Response.json({ message: "note created" })
      : Response.json({ message: "failed to create note" });
  } catch (e) {
    console.error(`failed to create note. reason: ${e}`);
    return Response.json({ message: `failed to create note. reason: ${e}` });
  }
});

notes.put("/:id", async (ctx: ContextExtended) => {});

notes.delete("/:id", async (ctx: ContextExtended) => {});

export default notes;
