let db;
let dbReq = indexedDB.open("test-db", 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;

  let datas = db.createObjectStore("datas", { autoIncrement: true });
};

dbReq.onsuccess = event => {
  db = event.target.result;

  getAndDisplayDatas(db);
};

dbReq.onerror = event => {
  alert("error opening database " + event.target.errorCode);
};

const addData = (db, obj) => {
  const { npm, name, score } = obj;
  const tx = db.transaction(["datas"], "readwrite");
  const store = tx.objectStore("datas");
  const data = { npm, name, score };

  store.add(data);

  tx.oncomplete = () => getAndDisplayDatas(db);
  tx.onerror = event => alert("error storing data " + event.target.errorCode);
};

const submitData = () => {
  let dataObj = {};

  [dataObj.npm, dataObj.name, dataObj.score] = [
    document.getElementById("npm").value,
    document.getElementById("name").value,
    document.getElementById("score").value
  ];

  addData(db, dataObj);

  [dataObj.npm, dataObj.name, dataObj.score] = ["", "", ""];
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
  let tx = db.transaction(["datas"], "readonly");
  let store = tx.objectStore("datas");

  let req = store.openCursor();
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
