import { Injectable } from '@angular/core';
import { browser } from 'protractor';

var SyncMysql = require('sync-mysql');
var Mysql = require('mysql');

@Injectable()
export class MySQLDB {
    private connection : any;
    private connectionSync : any;
    private waitTime = 2000;

    constructor() {
        this.connectionSync = new SyncMysql({
            host:browser.params.databaseHost,
            user:browser.params.databaseUsername,
            password:browser.params.databasePassword,
            database: browser.params.databaseNameTest
        });
    }

    getConnection() {
        return this.connection;
    }

    getConnectionSync() {
        return this.connectionSync;
    }

    executeSQLSync(sql) {
        var result : any;
        this.connectionSync = new SyncMysql({
            host:browser.params.databaseHost,
            user:browser.params.databaseUsername,
            password:browser.params.databasePassword,
            database: browser.params.databaseNameTest
        });
        result = JSON.stringify(this.connectionSync.query(sql));
        this.connectionSync.dispose();
        return result;
    }

    executeSQLSyncWithParams(sql, param) {
        var result : any;
        result = JSON.stringify(this.connectionSync.query(sql, param));
        return result;
    }

    executeSQL(sql) {
        this.connection = Mysql.createConnection({
            host:browser.params.databaseHost,
            user:browser.params.databaseUsername,
            password:browser.params.databasePassword,
            database: browser.params.databaseNameTest
        });
        this.connection.connect();
        this.connection.query(sql);
        browser.sleep(this.waitTime);
        this.connection.end();
    }

    executeSQLWithParams(sql, param) {
        this.connection = Mysql.createConnection({
            host:browser.params.databaseHost,
            user:browser.params.databaseUsername,
            password:browser.params.databasePassword,
            database: browser.params.databaseNameTest
        });
        this.connection.connect();
        this.connection.query(sql, param);
        browser.sleep(this.waitTime);
        this.connection.end();
    }
}