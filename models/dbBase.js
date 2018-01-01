const config = require('../config')
const bcrypt = require('bcrypt');

const TOKEN_LEN = 40;
const SALT_RNDS = 10;

class DatabaseBase {

    constructor() {
        this.sql = require('mssql/msnodesqlv8');
    }

    connect(connectionString) {
        
        // return promise
        return this.sql.connect(connectionString);

    }
    
    select(tableName, columnNames, columnTypes, columnValues, returnColumns, conditions = null) {

        return new Promise( (resolve, reject) => {
                let columnNameValuePairs = {};
                let sql = `SELECT ${returnColumns.join()} FROM ${tableName}`;
                if(conditions)
                {
                    sql = sql.concat(` WHERE ${conditions}`);
                }
                const ps = new this.sql.PreparedStatement();
                for(let i = 0; i < columnNames.length; i++)
                {
                    ps.input(columnNames[i], columnTypes[i]);
                    columnNameValuePairs[columnNames[i]] = columnValues[i];
                }
                ps.prepare(sql, (err) => {
                    if (err) return reject(err);
                    ps.execute(columnNameValuePairs, (err, result) => {
                        if (err) return reject(err);
                        ps.unprepare((err) => {
                            if (err) return reject(err);
                            return resolve(result);
                        })
                    });
                })

            });

    }

    insert(tableName, columnNames, columnTypes, columnValues) {

        return new Promise((resolve, reject) => {
            let columnNameValuePairs = {};
            const sql = `INSERT INTO ${tableName} (${columnNames.join()}) VALUES (${columnNames.map((i)=>{return ('@'+i)}).join()})`;
            const ps = new this.sql.PreparedStatement();
            for(let i = 0; i < columnNames.length; i++)
            {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err) => {
                if (err) return reject(err);
                ps.execute(columnNameValuePairs, (err, result) => {
                    if (err) return reject(err);
                    ps.unprepare((err) => {
                        if (err) return reject(err);
                        return resolve(result);
                    })
                });
            })
        });

    }

    update(tableName, columnNames, columnTypes, columnValues, conditions = null) {

        return new Promise((resolve, reject) => {
            let columnNameValuePairs = {};
            let sql = `UPDATE ${tableName} SET ${columnNames.map((i)=>{return (i+'=@'+i)}).join()}`;
            if(conditions)
            {
                sql = sql.concat(` WHERE ${conditions}`);
            }
            console.log('query: ', sql);
            const ps = new this.sql.PreparedStatement();
            for(let i = 0; i < columnNames.length; i++)
            {
                ps.input(columnNames[i], columnTypes[i]);
                columnNameValuePairs[columnNames[i]] = columnValues[i];
            }
            ps.prepare(sql, (err) => {
                if (err) return reject(err);
                ps.execute(columnNameValuePairs, (err, result) => {
                    if (err) return reject(err);
                    ps.unprepare((err) => {
                        if (err) return reject(err);
                        return resolve(result);
                    })
                });
            })
        });

    }

};

module.exports = DatabaseBase;