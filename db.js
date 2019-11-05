let db;
let dbReq = indexedDB.open("test-db", 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;

  let notes = db.createObjectStore("notes", { autoIncrement: true });
};

dbReq.onsuccess = event => {
  db = event.target.result;
};

dbReq.onerror = event => {
  alert("error opening database " + event.target.errorCode);
};
