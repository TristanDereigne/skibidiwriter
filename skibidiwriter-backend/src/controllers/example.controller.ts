import exampleService from "@/services/example.service";
import { Hono } from "hono";

export const exampleController = new Hono().get("/", async (ctx) => {
  const examples = await exampleService.findAll();

  return ctx.json(examples);
});
