const lunr = require("lunr");
let index;
let db;

/**
 * 重制内存库
 */
function createIndex(data) {
  // index= lunr();
  index = lunr(function() {
    this.field("file");
    this.field("type");
    this.field("path");
    if (data && data.length) {
      data.forEach(item => {
        this.add(item);
      });
    }
  });
}

function find(query, cb) {
  if (!index) {
    throw new Error("创建index失败");
  }
  const results = index.search(query);
  console.log(results);
  cb(results);
}

module.exports = { createIndex, find };
