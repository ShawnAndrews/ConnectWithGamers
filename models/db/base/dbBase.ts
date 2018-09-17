import { createConnection, Connection, MysqlError, FieldInfo } from "mysql";
import { GenericResponseModel } from "../../../client/client-server-common/common";
import config from "../../../config";

export default class DatabaseBase {

    connection: Connection;

    constructor() {
        this.connection = createConnection(config.mysql);
        this.connection.connect((err) => {
            if (err) {
                console.error("Failed to connect to MySQL db: " + err.stack);
                process.exit();
            }
        });
    }

    /**
     * SQL Select wrapper.
     */
    select(tableName: string, returnColumns: Array<string>, conditions: string = undefined, conditionVals: any[] = undefined, numRecords: number = undefined): Promise<GenericResponseModel> {
        return new Promise( (resolve, reject) => {
                const response: GenericResponseModel = {error: undefined, data: undefined};
                let preparedVars: any[];
                let query: string;

                // prepare variables
                if (conditions) {
                    preparedVars = conditionVals;
                }

                // prepare query
                query = `SELECT ${returnColumns} FROM ${config.mysql.database}.${tableName}`;
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
     * SQL Insert wrapper.
     */
    insert(tableName: string, columnNames: string[], columnValues: any[], preparedValues: string): Promise<GenericResponseModel> {

        return new Promise((resolve, reject) => {
            const response: GenericResponseModel = {error: undefined, data: undefined};
            let preparedVars: any[];
            let query: string;

            // prepare variables
            preparedVars = columnValues;

            // prepare query
            query =  `INSERT INTO ${config.mysql.database}.${tableName} (${columnNames.join(",")}) VALUES (${preparedValues})`;

            // execute query
            this.connection.query(query, preparedVars, (error: MysqlError | null, results: any, fields: FieldInfo[]) => {
                if (error) {
                    console.log(`INSERT error: ${JSON.stringify(error)}`);
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
    update(tableName: string, preparedValues: string, columnValues: any[], conditions: string = undefined, conditionVals: any[] = undefined): Promise<GenericResponseModel> {

        return new Promise((resolve, reject) => {
            const response: GenericResponseModel = {error: undefined, data: undefined};
            let preparedVars: any[];
            let query: string;

            // prepare variables
            preparedVars = columnValues.concat(conditionVals ? conditionVals : []);

            // prepare query
            query =  `UPDATE ${config.mysql.database}.${tableName} SET ${preparedValues}`;
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

}