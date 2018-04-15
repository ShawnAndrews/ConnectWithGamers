const mssql = require("mssql/msnodesqlv8");
import config from "../../config";

/**
 * Connect a SQL Server database.
 */
export default function connectToDatabase(): void {

    // connect to db
    mssql.connect(config.connectionStrings["local"])
    .then(() => {
        console.log(`Successfully connected to database.`);
    })
    .catch((error: any) => {
        console.log(`Error connecting to db: ${error}. Shutting down now.`);
        process.exit();
    });

}