"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestContext = void 0;
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const get_port_1 = __importStar(require("get-port"));
const graphql_request_1 = require("graphql-request");
const nanoid_1 = require("nanoid");
const path_1 = require("path");
const pg_1 = require("pg");
const db_1 = require("../api/db");
const server_1 = require("../api/server");
function createTestContext() {
    let ctx = {};
    const graphqlCtx = graphqlTestContext();
    const prismaCtx = prismaTestContext();
    beforeEach(async () => {
        const client = await graphqlCtx.before();
        const db = await prismaCtx.before();
        Object.assign(ctx, {
            client,
            db,
        });
    });
    afterEach(async () => {
        await graphqlCtx.after();
        await prismaCtx.after();
    });
    return ctx;
}
exports.createTestContext = createTestContext;
function graphqlTestContext() {
    let serverInstance = null;
    return {
        async before() {
            const port = await get_port_1.default({ port: get_port_1.makeRange(4000, 6000) });
            serverInstance = await server_1.server.listen({ port });
            serverInstance.server.on('close', async () => {
                await db_1.db.$disconnect();
            });
            return new graphql_request_1.GraphQLClient(`http://localhost:${port}`);
        },
        async after() {
            serverInstance === null || serverInstance === void 0 ? void 0 : serverInstance.server.close();
        },
    };
}
function prismaTestContext() {
    const prismaBinary = path_1.join(__dirname, '..', 'node_modules', '.bin', 'prisma');
    let schema = '';
    let databaseUrl = '';
    let prismaClient = null;
    return {
        async before() {
            // Generate a unique schema identifier for this test context
            schema = `test_${nanoid_1.nanoid()}`;
            // Generate the pg connection string for the test schema
            databaseUrl = `postgres://postgres:postgres@localhost:5432/testing?schema=${schema}`;
            // Set the required environment variable to contain the connection string
            // to our database test schema
            process.env.DATABASE_URL = databaseUrl;
            // Run the migrations to ensure our schema has the required structure
            child_process_1.execSync(`${prismaBinary} migrate up --create-db --experimental`, {
                env: {
                    ...process.env,
                    DATABASE_URL: databaseUrl,
                },
            });
            // Construct a new Prisma Client connected to the generated Postgres schema
            prismaClient = new client_1.PrismaClient();
            return prismaClient;
        },
        async after() {
            // Drop the schema after the tests have completed
            const client = new pg_1.Client({
                connectionString: databaseUrl,
            });
            await client.connect();
            await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            await client.end();
            // Release the Prisma Client connection
            await (prismaClient === null || prismaClient === void 0 ? void 0 : prismaClient.$disconnect());
        },
    };
}
//# sourceMappingURL=__helpers.js.map