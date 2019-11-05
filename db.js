let db;
let dbReq = indexedDB.open("test-db", 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;

  let notes = db.createObjectStore("notes", { autoIncrement: true });
};

dbReq.onsuccess = event => {
  db = event.target.result;

  addStickyNote(db, "Sloths are awesome!");
  addStickyNote(db, "I need to go to the bathroom!");
};

dbReq.onerror = event => {
  alert("error opening database " + event.target.errorCode);
};

const addStickyNote = (db, message) => {
  let tx = db.transaction(["notes"], "readwrite");
  let store = tx.objectStore("notes");
  let note = { text: message, timestamp: Date.now() };

  store.add(note);

  tx.oncomplete = () => console.log("stored note!");
  tx.onerror = event => alert("error storing note " + event.target.errorCode);
};
