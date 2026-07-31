import fs from "node:fs";

function loadLocalEnv() {
    if (!fs.existsSync(".env")) return;

    const envFile = fs.readFileSync(".env", "utf8");
    for (const line of envFile.split("\n")) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
            continue;
        }

        const [key, ...valueParts] = trimmedLine.split("=");
        const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        process.env[key.trim()] ??= value;
    }
}

loadLocalEnv();

const databaseUrl = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!databaseUrl) {
    throw new Error("NEXT_PUBLIC_DRIZZLE_DB_URL is required to run Drizzle.");
}

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseUrl,
    }
};
