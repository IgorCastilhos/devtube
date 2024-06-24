"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_libsql_1 = require("@prisma/adapter-libsql");
var client_2 = require("@libsql/client");
var TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
var TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
if (!TURSO_DATABASE_URL) {
    throw new Error("Missing TURSO_DATABASE_URL");
}
var libsql = (0, client_2.createClient)({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});
var adapter = new adapter_libsql_1.PrismaLibSQL(libsql);
var prisma = new client_1.PrismaClient({ adapter: adapter });
exports.default = prisma;
