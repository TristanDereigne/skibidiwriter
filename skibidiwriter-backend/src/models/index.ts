import { defineRelations } from "drizzle-orm";
import { exampleTable } from "./example.model";

export const relations = defineRelations({
  exampleTable,
});



export { exampleTable };
