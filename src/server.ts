import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import config from "config";
import { app } from "./app";
import { createProductsTableIfDoesNotExist } from "./util/createProductsTableIfDoesNotExist";

const port = config.get("server.port");

setImmediate(async () => {
  await createProductsTableIfDoesNotExist(new DynamoDBClient(config.get("dynamodb")));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
