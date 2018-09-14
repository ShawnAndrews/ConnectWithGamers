const mssql = require("mssql/msnodesqlv8");
import config from "../../config";

/**
 * Connect to a SQL Server database.
 */
export default function connectToDatabase(): void {

    // connect to db
    mssql.connect(config.connectionStrings["local"])
    .catch((error: any) => {
        console.log(`Error connecting to db: ${error}. Shutting down now.`);
        process.exit();
    });

}