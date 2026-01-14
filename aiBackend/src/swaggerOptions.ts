const port = 3000;
export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Простое Node.js API на TS",
            version: "1.0.0",
            description: "API с TypeScript и Swagger",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ["./src/index.ts"],
};