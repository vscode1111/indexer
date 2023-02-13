const env = process.env;

function parseBoolean(value: string | undefined) {
  return value?.toLowerCase() === "true";
}

export const config = Object.freeze({
  port: Number(env.PORT || 3001),
  scheduler: {
    enable: parseBoolean(env.SCHEDULER_ENABLE),
    syncRule: env.SCHEDULER_SYNC_RULE || `*/5 * * * * *`,
    statsRule: env.SCHEDULER_STATS_RULE || `* * * * * *`,
  },
  database: {
    host: env.DATABASE_HOST || `localhost`,
    port: Number(env.DATABASE_PORT || 5432),
    username: env.DATABASE_USERNAME || "postgres",
    password: env.DATABASE_PASSWORD || "postgres",
    name: env.DATABASE_NAME || "indexer",
  },
  sync: {
    onlineOffset: Number(env.SYNC_ONLINE_OFFSET || 5),
    threadCount: Number(env.SYNC_THREAD_COUNT || 10),
    minBlocCount: Number(env.SYNC_MIN_BLOCK_COUNT || 10000),
  },
});

function checkConfig(config: object) {
  const entries = Object.entries(config);
  for (const entry of entries) {
    const value = entry[1];
    if (value === undefined) {
      throw new Error(`Please set your ${entry[0]} in a .env file`);
    } else if (typeof value === "object") {
      checkConfig(value);
    }
  }
}
checkConfig(config);

console.log(config);
