require("dotenv").config();

const common = {
  db: {
    connection_string: process.env.DATABASE_URL,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "papyro",
    password: process.env.DB_PASSWORD || "papyro",
    name: process.env.DB_NAME || "papyro",
    port: process.env.DB_PORT || 5432
  },
  force: (process.env.FORCE==="true") || false,
  jwtSecret: "spgion5in4t4",
  allowPosts: (process.env.ALLOW_POSTS === "true")
};

const development = {
  showErrors: true,
  host: "http://localhost:" + (process.env.PORT || 3000)
};

const production = {
  showErrors: false,
  host: "http://papyro.com"
};

const env = process.env.NODE_ENV;
Object.assign(common, (env==="production") ? production : development);

module.exports = common;