const mssql = require("mssql/msnodesqlv8");
import { GenericResponseModel } from "../../../client/client-server-common/common";

export default class DatabaseBase {

    sql: any;

    constructor() {
        this.sql = mssql;
    }

    /**
     * SQL Select wrapper.
     */
    select(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>, returnColumns: Array<string>, conditions: string = undefined, numRecords: number = undefined): Promise<GenericResponseModel> {
        return new Promise( (resolve, reject) => {
                const columnNameValuePairs: any = {};
                const response: GenericResponseModel = {error: undefined, data: undefined};
                let sql = `SELECT ${numRecords ? `top ${numRecords}` : ``} ${returnColumns.join()} FROM ${tableName}`;
                if (conditions) {
                    sql = sql.concat(` WHERE ${conditions}`);
                }
                const ps = new this.sql.PreparedStatement();
                for (let i = 0; i < columnNames.length; i++) {
                    ps.input(columnNames[i], columnTypes[i]);
                    columnNameValuePairs[columnNames[i]] = columnValues[i];
                }
                ps.prepare(sql, (err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    ps.execute(columnNameValuePairs, (err: any, result: any) => {
                        if (err) {
                            return reject(err);
                        }
                        ps.unprepare((err: any) => {
                            if (err) {
                                return reject(err);
                            }
                            response.data = result;
                            return resolve(response);
                        });
                    });
                });
            });

    }

    /**
     * SQL Insert wrapper.
     */
    insert(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>): Promise<GenericResponseModel> {

        return new Promise((resolve, reject) => {
            const columnNameValuePairs: any = {};
            const response: GenericResponseModel = {error: undefined, data: undefined};
            const sql = `INSERT INTO ${tableName} (${columnNames.join()}) VALUES (${columnNames.map((i) => {return ("@" + i); }).join()})`;
            const ps = new this.sql.PreparedStatement();
            for (let i = 0; i < columnNames.length; i++) {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err: any) => {
                if (err) {
                    return reject(err);
                }
                ps.execute(columnNameValuePairs, (err: any, result: any) => {
                    if (err) {
                        return reject(err);
                    }
                    ps.unprepare((err: any) => {
                        if (err) {
                            return reject(err);
                        }
                        response.data = result;
                        return resolve(response);
                    });
                });
            });
        });

    }

    /**
     * SQL Update wrapper.
     */
    update(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>, columnNamesToUpdate: Array<string>, conditions: string = undefined): Promise<GenericResponseModel> {

        return new Promise((resolve, reject) => {
            const columnNameValuePairs: any = {};
            const response: GenericResponseModel = {error: undefined, data: undefined};
            let sql = `UPDATE ${tableName} SET ${columnNamesToUpdate.map((i) => {return (i + "=@" + i); }).join()}`;
            if (conditions) {
                sql = sql.concat(` WHERE ${conditions}`);
            }
            const ps = new this.sql.PreparedStatement();
            for (let i = 0; i < columnNames.length; i++) {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err: any) => {
                if (err) {
                    return reject(err);
                }
                ps.execute(columnNameValuePairs, (err: any, result: any) => {
                    if (err) {
                        return reject(err);
                    }
                    ps.unprepare((err: any) => {
                        if (err) {
                            return reject(err);
                        }
                        response.data = result;
                        return resolve(response);
                    });
                });
            });
        });

    }

}