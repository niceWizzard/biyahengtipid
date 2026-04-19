import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './user';

export const trips = pgTable('trips', {
  id: t.serial('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: t.varchar('name', { length: 255 }).notNull(),
  createdAt: t
    .timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tripStops = pgTable('trip_stops', {
  id: t.serial('id').primaryKey(),
  tripId: t
    .integer('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  name: t.varchar('name', { length: 255 }).notNull(),
  createdAt: t
    .timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  longitude: t.doublePrecision('longitude').notNull(),
  latitude: t.doublePrecision('latitude').notNull(),
  visitOrder: t.integer('visit_order').notNull(),
});
