import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { trips, tripStops } from './schema';

export type Trip = InferSelectModel<typeof trips>;
export type TripStop = InferSelectModel<typeof tripStops>;
export type TripStopInsert = InferInsertModel<typeof tripStops>;
