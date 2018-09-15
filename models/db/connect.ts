const mssql: any = undefined;
const Connection = require("tedious").Connection;
import config from "../../config";

const configDb = {
    userName: "POSUser",
    password: "123456789",
    server: "localhost",
    options: {
        database: "ConnectWithGamers",
        encrypt: false
    },
    dialect: "mssql",
    dialectOptions: {
        "instanceName": "SQLEXPRESS"
    }
};

/**
 * Connect to a SQL Server database.
 */
export default function connectToDatabase(): void {

    // const connection = new Connection(configDb);

    // connection.on("connect", (err: any) => {
    //     console.log(`Connected? ${JSON.stringify(err)}`);
    //     }
    //   );

    // connect to db
    // mssql.connect(config.connectionStrings["local"])
    // .catch((error: any) => {
    //     console.log(`Error connecting to db: ${error}. Shutting down now.`);
    //     process.exit();
    // });

}