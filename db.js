let db;
let dbReq = indexedDB.open("test-db", 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;

  let datas = db.createObjectStore("datas", {
    autoIncrement: true,
    keyPath: "npm"
  });
};

dbReq.onsuccess = event => {
  db = event.target.result;

  getAndDisplayDatas(db);
};

dbReq.onerror = event => {
  alert("error opening database " + event.target.errorCode);
};

const submitData = () => {
  let dataObj = {};

  [dataObj.npm, dataObj.name, dataObj.score] = [
    parseInt(document.getElementById("npm").value),
    document.getElementById("name").value,
    parseInt(document.getElementById("score").value)
  ];

  const tx = db.transaction(["datas"], "readwrite");
  const store = tx.objectStore("datas");

  store.add(dataObj);

  tx.oncomplete = () => {
    [dataObj.npm, dataObj.name, dataObj.score] = ["", "", ""];
    getAndDisplayDatas(db);
  };
  tx.onerror = event => alert("error storing data " + event.target.errorCode);
};

const deleteData = npm => {
  const tx = db.transaction(["datas"], "readwrite");
  const store = tx.objectStore("datas");

  store.delete(npm);

  tx.oncomplete = () => getAndDisplayDatas(db);
  tx.onerror = event => alert("error deleting data " + event.target.errorCode);
};

const editData = () => {
  let dataObj = {};

  [dataObj.npm, dataObj.name, dataObj.score] = [
    parseInt(document.getElementById("npm-edited").value),
    document.getElementById("name-edited").value,
    parseInt(document.getElementById("score-edited").value)
  ];

  const tx = db.transaction(["datas"], "readwrite");
  const store = tx.objectStore("datas");

  store.put(dataObj);

  tx.oncomplete = () => getAndDisplayDatas(db);
  tx.onerror = event => alert("error editing data " + event.target.errorCode);
};

const displayDatas = data => {
  const dataObj = { data };

  const rawTemplate = document.getElementById("data-template").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  const generatedHtml = compiledTemplate(dataObj);
  const datasContainer = document.getElementById("data-table");

  datasContainer.innerHTML = generatedHtml;
};

const getAndDisplayDatas = db => {
  const tx = db.transaction(["datas"], "readonly");
  const store = tx.objectStore("datas");

  const req = store.openCursor();
  let allDatas = [];

  req.onsuccess = event => {
    let cursor = event.target.result;

    if (cursor) {
      allDatas.push(cursor.value);
      cursor.continue();
    } else displayDatas(allDatas);
  };

  req.onerror = event => {
    alert("error cursor in request " + event.target.errorCode);
  };
};
