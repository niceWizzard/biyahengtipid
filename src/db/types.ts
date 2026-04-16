import { InferSelectModel } from "drizzle-orm";
import { trips } from "./schema";

export type Trip = InferSelectModel<typeof trips>