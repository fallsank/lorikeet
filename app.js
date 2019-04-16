const fs = require("fs");
const osenv = require("osenv");
const path = require("path");
const async = require("async");

/**
 * 获取根目录
 */
function getUsersHomeFolder() {
  return osenv.home();
}

/**
 * 获取文件夹中的文件
 * @param {String} folderPath 文件目录路径
 * @param {*} cb
 */
function getFilesInFolder(folderPath, cb) {
  fs.readdir(folderPath, cb);
}

function inspectAndDescribeFile(filePath, cb) {
  let result = {
    file: path.basename(filePath),
    path: filePath,
    type: ""
  };
  fs.stat(filePath, (err, stats) => {
    if (err) {
      cb(err);
    } else {
      if (stats.isFile()) {
        result.type = "file";
      } else if (stats.isDirectory()) {
        result.type = "directory";
      }
      cb(err, result);
    }
  });
}

function inspectAndDescribeFiles(folderPath, files, cb) {
  async.map(
    files,
    (file, asyncCb) => {
      let resolvedFilePath = path.resolve(folderPath, file);
      inspectAndDescribeFile(resolvedFilePath, asyncCb);
    },
    cb
  );
}

function displayFiles(err, files) {
  if (err) {
    return console.log("we could not load your home folder");
  }
  files.forEach(file => {
    console.log(file);
    displayFile(file);
  });
}

function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);
  clone.querySelector("img").src = "";
  clone.querySelector(".filename").innerText = file.file;
  mainArea.append(clone);
}

function main() {
  const folderPath = getUsersHomeFolder();
  getFilesInFolder(folderPath, (err, files) => {
    if (err) {
      return console.log("we could not load your home folder");
    }
    inspectAndDescribeFiles(folderPath, files, displayFiles);
  });
}

main();
