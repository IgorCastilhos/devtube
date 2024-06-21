import {PrismaClient} from "@prisma/client";
import {PrismaLibSQL} from "@prisma/adapter-libsql";
import {createClient} from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
    throw new Error("Missing TURSO_DATABASE_URL");
}

const libsql = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({adapter});

export default prisma
