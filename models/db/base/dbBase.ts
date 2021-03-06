import { createConnection, Connection, MysqlError, FieldInfo } from "mysql";
import { GenericModelResponse } from "../../../client/client-server-common/common";
import config from "../../../config";

export default class DatabaseBase {

    private connection: Connection;

    constructor() {
        this.connectToDatabase();

        // keep database connection alive
        setInterval(() => {
            this.connection.query("SELECT 1");
        }, 5000);
    }

    /**
     * Connect to MySQL database.
     */
    connectToDatabase(errCallback?: (err: MysqlError) => void): void {
        this.connection = createConnection(config.mysql.local);
        this.connection.connect(errCallback);
        this.connection.on("error", function(err) {
            console.log(err.code);
            if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
                console.log(`Connection to MySQL database lost. Retrying...`);
                setTimeout(this.connectToDatabase, 2000);
            }
        });
    }

    /**
     * SQL Insert wrapper.
     */
    insert(tableName: string, columnNames: string[], columnValues: any[], preparedValues: string, debugOutput: boolean = true): Promise<GenericModelResponse> {

        return new Promise((resolve, reject) => {
            const response: GenericModelResponse = {error: undefined, data: undefined};
            let preparedVars: any[];
            let query: string;

            // prepare variables
            preparedVars = columnValues;

            // prepare query
            query =  `INSERT INTO ${tableName} (${columnNames.join(",")}) VALUES (${preparedValues})`;

            // execute query
            this.connection.query(query, preparedVars, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                if (error) {
                    if (debugOutput) {
                        console.log(`INSERT error: ${JSON.stringify(error)}`);
                    }
                    return reject(error);
                }
                response.data = results;
                return resolve(response);
            });

        });

    }

    /**
     * SQL Select wrapper.
     */
    select(tableName: string, returnColumns: Array<string>, conditions: string = undefined, conditionVals: any[] = undefined, numRecords: number = undefined): Promise<GenericModelResponse> {
        return new Promise( (resolve, reject) => {
                const response: GenericModelResponse = {error: undefined, data: undefined};
                let preparedVars: any[];
                let query: string;

                // prepare variables
                if (conditions) {
                    preparedVars = conditionVals;
                }

                // prepare query
                query = `SELECT ${returnColumns} FROM ${tableName}`;
                if (conditions) {
                    query = query.concat(` WHERE ${conditions}`);
                }
                if (numRecords) {
                    query = query.concat(` LIMIT ${numRecords}`);
                }

                // execute query
                this.connection.query(query, preparedVars, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                    if (error) {
                        console.log(`SELECT error: ${JSON.stringify(error)}`);
                        return reject(error);
                    }
                    response.data = results;
                    return resolve(response);
                });

            });

    }

    /**
     * SQL custom query wrapper.
     */
    custom(query: string, preparedVars: any[]): Promise<GenericModelResponse> {
        return new Promise( (resolve, reject) => {
                const response: GenericModelResponse = {error: undefined, data: undefined};

                // execute query
                this.connection.query(query, preparedVars, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                    if (error && error.code !== `ER_DUP_ENTRY`) {
                        console.log(`CUSTOM error: ${JSON.stringify(error)}`);
                        return reject(error);
                    }
                    response.data = results;
                    return resolve(response);
                });

            });
    }

    /**
     * SQL Update wrapper.
     */
    update(tableName: string, preparedValues: string, columnValues: any[], conditions: string = undefined, conditionVals: any[] = undefined): Promise<GenericModelResponse> {

        return new Promise((resolve, reject) => {
            const response: GenericModelResponse = {error: undefined, data: undefined};
            let preparedVars: any[];
            let query: string;

            // prepare variables
            preparedVars = columnValues.concat(conditionVals ? conditionVals : []);

            // prepare query
            query =  `UPDATE ${tableName} SET ${preparedValues}`;
            if (conditions) {
                query = query.concat(` WHERE ${conditions}`);
            }

            // execute query
            this.connection.query(query, preparedVars, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                if (error) {
                    console.log(`UPDATE error: ${JSON.stringify(error)}`);
                    return reject(error);
                }
                response.data = results;
                return resolve(response);
            });

        });

    }

    /**
     * SQL Delete wrapper.
     */
    delete(tableName: string, preparedValues: string[], values: any[]): Promise<GenericModelResponse> {

        return new Promise((resolve, reject) => {
            const response: GenericModelResponse = {error: undefined, data: undefined};
            let query: string;

            // prepare query
            query =  `DELETE FROM ${tableName} WHERE ${preparedValues.join(" AND ")}`;

            // execute query
            this.connection.query(query, values, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                if (error) {
                    console.log(`DELETE error: ${JSON.stringify(error)}`);
                    return reject(error);
                }
                response.data = results;
                return resolve(response);
            });

        });

    }

}