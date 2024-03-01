const { Client } = require("cassandra-driver");
const credentials = require("../client_secret_63120677216-lhlmm85r7esj0t8ra040qu05ak82un55.apps.googleusercontent.com.json");

async function run() {
  const client = new Client({
    cloud: {
      secureConnectBundle: "./secure-connect-db-youtube (1).zip",
    },
    credentials: {
      username:
        "63120677216-lhlmm85r7esj0t8ra040qu05ak82un55.apps.googleusercontent.com",
      password: "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",
    },
  });

  await client.connect();

  // Execute a query
  const rs = await client.execute("SELECT * FROM system.local");
  console.log(`Your cluster returned ${rs.rowLength} row(s)`);

  await client.shutdown();
}

// Run the async function
run();

// 6e465a19-5f95-4ec9-8737-188303c15d4c
