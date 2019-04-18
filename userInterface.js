const path = require("path");
const fileSystem = require("./fileSystem");
const search = require("./search");

function convertFolderPathToLink(folderPath) {
  const folders = folderPath.split(path.sep);
  let pathAtFolders = "";
  const contents = [];
  console.log(folders);
  folders.forEach(folder => {
    pathAtFolders += folder + path.sep;
    contents.push(`<span data-path='${pathAtFolders.slice(0, -1)}' class="path">${folder}</span>`);
  });
  return contents.join(path.sep).toString();
}

function displayFolderPath(folderPath) {
  document.getElementById("current-folder").innerHTML = convertFolderPathToLink(folderPath);
  bindFolderPathLink();
}

function bindFolderPathLink() {
  const pathEles = document.getElementsByClassName("path");
  for (let i = 0; i < pathEles.length; i++) {
    let pathEle = pathEles[i];
    pathEle.addEventListener(
      "click",
      evt => {
        const folderPath = evt.target.getAttribute("data-path");
        loadDirectory(folderPath)();
      },
      false
    );
  }
}

function clearView() {
  const mainArea = document.getElementById("main-area");
  let firstChild = mainArea.firstChild;
  while (firstChild) {
    mainArea.removeChild(firstChild);
    firstChild = mainArea.firstChild;
  }
}

function loadDirectory(folderPath) {
  return function(window) {
    if (!document) document = window.document;

    displayFolderPath(folderPath);
    fileSystem.getFilesInFolder(folderPath, (err, files) => {
      clearView();
      if (err) {
        return alert("sorry, you could not load your folder");
      }
      fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
    });
  };
}

function displayFiles(err, files) {
  if (err) {
    return console.log("we could not load your home folder");
  }
  files = [...files.filter(item => item.type === "directory"), ...files.filter(item => item.type === "file")];
  files.forEach(file => {
    console.log(file);
    displayFile(file);
  });
  console.log("files", files);
  search.createIndex(files);
}

function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);
  let imgEle = clone.querySelector("img");
  imgEle.src = `./images/${file.type}.svg`;
  imgEle.setAttribute("data-filepath", file.path);

  clone.querySelector(".filename").innerText = file.file;
  if (file.type === "directory") {
    clone.querySelector("img").addEventListener(
      "dblclick",
      () => {
        console.log("hello world");
        loadDirectory(file.path)();
      },
      false
    );
  } else if (file.type === "file") {
    clone.querySelector("img").addEventListener(
      "dblclick",
      () => {
        fileSystem.openFile(file);
      },
      false
    );
  }
  mainArea.append(clone);
}

function filterResults(results) {
  const validFilePaths = results.map(result => result.path);
  const items = document.getElementsByClassName("item");
  for (let i = 0; i < items.length; i++) {
    const element = items[i];
    let filePath = element.getElementsByTagName("img")[0].getAttribute("data-filepath");
    if (validFilePaths.indexOf(filePath) > -1) element.style = null;
    else element.style = "display:none";
  }
}

function resetFilter() {
  const items = document.getElementsByClassName("item");
  for (let i = 0; i < items.length; i++) {
    items[i].style = null;
  }
}

function bindDocument(window) {
  if (!document) {
    document = window.document;
  }
}

function bindSearchField(cb) {
  document.getElementById("search").addEventListener("keyup", cb, false);
}

module.exports = { bindDocument, displayFiles, loadDirectory, filterResults, resetFilter, bindSearchField };
