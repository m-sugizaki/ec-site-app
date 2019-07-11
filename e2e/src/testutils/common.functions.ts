import { Injectable } from '@angular/core';
import {HttpClient} from "protractor-http-client";
import { browser } from 'protractor';
import { MySQLDB } from './mysql.db';

var fs = require('fs');
var md5 = require('md5');

@Injectable()
export class CommonFuns {
    private api = browser.params.serverUrl;
    private evidenceNameFolder = "e2e\\evidence";
    private http: HttpClient;
    private mySQLDB: MySQLDB;

    constructor(
    ) {
        this.http = new HttpClient(this.api);
        this.mySQLDB = new MySQLDB();
        if (fs.existsSync(this.evidenceNameFolder)) {}
        else {
          fs.mkdirSync(this.evidenceNameFolder);
        }
    }

    getRootEvidenceFolderName() {
        return this.evidenceNameFolder;
    }

    initEvidenceFolder(folderName) {
        rmDir(folderName);
        fs.mkdirSync(folderName);
    }

    writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer( data, 'base64'));
        stream.end();
    }

    getDataFromRestAPI(childUrl) {
        return this.http.get(childUrl);
    }

    postDataToRestAPI(childUrl, data){
        return this.http.post(childUrl, data);
    }

    getJsonDataFromJsonBodyOfResponsePromise(jsonBody) {
      return new Promise((resolve, reject) => {
        let result = Promise.resolve(jsonBody);
        result.then((value) => {
          resolve(value)
        }).catch((err) => {
          reject(err)
        });
      })
    }

    formatDate(input) {
      let date = new Date(input);
      let day = date.getDate();
      let dd = this.checkSmallerThan10(day);
      let month = date.getMonth() + 1;
      let mm = this.checkSmallerThan10(month);
      let yy = date.getFullYear();
      return `${yy}/${mm}/${dd}`
    }

    checkSmallerThan10(input) {
      let output: any;
      if(input < 10) {
        return output = '0' + input;
      } else {
        return input;
      }
    }

    formatDatetime(input) {
      let date = new Date(input);
      let day = date.getDate();
      let dd = this.checkSmallerThan10(day);
      let month = date.getMonth() + 1;
      let mm = this.checkSmallerThan10(month);
      let yy = date.getFullYear();
      let hour = date.getHours();
      let hh = this.checkSmallerThan10(hour);
      let minute = date.getMinutes();
      let min = this.checkSmallerThan10(minute);
      return `${yy}/${mm}/${dd} ${hh}:${min}`
    }

    checkFormatYY(input){
      return input % 100;
    }

    formatYYYYMMDD(input) {
      let date = new Date(input);
      let dd = date.getDate();
      dd = this.checkSmallerThan10(dd);
      let mm = date.getMonth()+1;
      mm = this.checkSmallerThan10(mm);
      let yy = date.getFullYear();
      return `${yy}/${mm}/${dd}`
    }

    formatMonthYear(input){
      let date = new Date(input);
      let mm = date.getMonth() + 1;
      mm = this.checkSmallerThan10(mm);
      let yy = date.getFullYear();
      yy = this.checkFormatYY(yy);
      return `${mm}/${yy}`

    }

    getEvaluation(number) {
      switch (number) {
        case 1:
          return '★☆☆☆☆';
        case 2:
          return '★★☆☆☆';
        case 3:
          return '★★★☆☆';
        case 4:
          return '★★★★☆';
        case 5:
          return '★★★★★';
      }
    }

    getMd5Encode(data) {
      return md5(data);
    }

    waitForSendKeysAngular(){
      browser.sleep(1000);
    }
    waitForLoadPage() {
      browser.sleep(2000);
    }

    createUserForTest() {
        var resultFindUser : any;
        var userTest = browser.params.userForTest;
        var pass = this.getMd5Encode(browser.params.passwordOfUserForTest);
        var sqlSelect = "SELECT * FROM user_store WHERE user_id = '" + userTest + "'";
        var sqlDelete2 = "DELETE FROM user WHERE user_id = '" + userTest + "'";
        var sqlDelete = "DELETE FROM user_store WHERE user_id = '" + userTest + "'";
        var sqlInsert = "INSERT INTO user_store VALUES ('" + userTest + "','" + pass + "')";
        var sqlInsert2 = "INSERT INTO user VALUES ('" + userTest + "','CSV TEST','CSV TEST','111-1111', '都道府県、市町村、丁目番地', " +
                  "'ビル、マンションなど', '11111-1111-1111','csvtest@gmail.com','1988-04-05','一般')";
        resultFindUser = JSON.parse(this.mySQLDB.executeSQLSync(sqlSelect));

        if (resultFindUser && resultFindUser.length === 1) {
          if (resultFindUser[0].password === pass) {
          } else {
            this.mySQLDB.executeSQLSync(sqlDelete);
            this.mySQLDB.executeSQLSync(sqlInsert);
          }
          this.mySQLDB.executeSQLSync(sqlDelete2);
          this.mySQLDB.executeSQLSync(sqlInsert2);
        } else {
          this.mySQLDB.executeSQLSync(sqlInsert);
          this.mySQLDB.executeSQLSync(sqlDelete2);
          this.mySQLDB.executeSQLSync(sqlInsert2);
        }
    }

    switchToOtherWindow(index) {
      browser.getAllWindowHandles().then(function(handles){
        if (index < handles.length) {
          browser.switchTo().window(handles[index]);
        }
      });
    }
}

function rmDir (dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
         }
    fs.rmdirSync(dirPath);
};
