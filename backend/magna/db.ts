import { SQLDatabase } from "encore.dev/storage/sqldb";

export const magnaDB = new SQLDatabase("magna", {
  migrations: "./migrations",
});
