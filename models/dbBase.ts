const mssql = require("mssql/msnodesqlv8");
import config from "../config";
import { Object } from "aws-sdk/clients/s3";
import { ResponseModel } from "../client/client-server-common/common";

const TOKEN_LEN = 40;
const SALT_RNDS = 10;

export default class DatabaseBase {

    sql: any;

    constructor() {
        this.sql = mssql;
    }

    connect(connectionString: string) {
        return this.sql.connect(connectionString);
    }

    select(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>, returnColumns: Array<string>, conditions: string = undefined): Promise<ResponseModel> {

        return new Promise( (resolve, reject) => {
                const columnNameValuePairs: any = {};
                const response: ResponseModel = {errors: [], data: undefined};
                let sql = `SELECT ${returnColumns.join()} FROM ${tableName}`;
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
                        response.errors.push(err);
                        return resolve(response);
                    }
                    ps.execute(columnNameValuePairs, (err: any, result: any) => {
                        if (err) {
                            response.errors.push(err);
                            return resolve(response);
                        }
                        ps.unprepare((err: any) => {
                            if (err) {
                                response.errors.push(err);
                                return resolve(response);
                            }
                            response.data = result;
                            return resolve(response);
                        });
                    });
                });
            });

    }

    insert(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>): Promise<ResponseModel> {

        return new Promise((resolve, reject) => {
            const columnNameValuePairs: any = {};
            const response: ResponseModel = {errors: [], data: undefined};
            const sql = `INSERT INTO ${tableName} (${columnNames.join()}) VALUES (${columnNames.map((i) => {return ("@" + i); }).join()})`;
            const ps = new this.sql.PreparedStatement();
            for (let i = 0; i < columnNames.length; i++) {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err: any) => {
                if (err) {
                    response.errors.push(err);
                    return resolve(response);
                }
                ps.execute(columnNameValuePairs, (err: any, result: any) => {
                    if (err) {
                        response.errors.push(err);
                        return resolve(response);
                    }
                    ps.unprepare((err: any) => {
                        if (err) {
                            response.errors.push(err);
                            return resolve(response);
                        }
                        response.data = result;
                        return resolve(response);
                    });
                });
            });
        });

    }

    update(tableName: string, columnNames: Array<string>, columnTypes: Array<any>, columnValues: Array<any>, conditions: string = undefined): Promise<ResponseModel> {

        return new Promise((resolve, reject) => {
            const columnNameValuePairs: any = {};
            const response: ResponseModel = {errors: [], data: undefined};
            let sql = `UPDATE ${tableName} SET ${columnNames.map((i) => {return (i + "=@" + i); }).join()}`;
            if (conditions) {
                sql = sql.concat(` WHERE ${conditions}`);
            }
            console.log("query: ", sql);
            const ps = new this.sql.PreparedStatement();
            for (let i = 0; i < columnNames.length; i++) {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err: any) => {
                if (err) {
                    response.errors.push(err);
                    return resolve(response);
                }
                ps.execute(columnNameValuePairs, (err: any, result: any) => {
                    if (err) {
                        response.errors.push(err);
                        return resolve(response);
                    }
                    ps.unprepare((err: any) => {
                        if (err) {
                            response.errors.push(err);
                            return resolve(response);
                        }
                        response.data = result;
                        return resolve(response);
                    });
                });
            });
        });

    }

}