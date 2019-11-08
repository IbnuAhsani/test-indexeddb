let db;
let dbReq = indexedDB.open("test-db", 1);

dbReq.onupgradeneeded = event => {
  db = event.target.result;

  let notes = db.createObjectStore("notes", { autoIncrement: true });
};

dbReq.onsuccess = event => {
  db = event.target.result;

  getAndDisplayNotes(db);
};

dbReq.onerror = event => {
  alert("error opening database " + event.target.errorCode);
};

const addData = (db, obj) => {
  const { npm, name, score } = obj;
  const tx = db.transaction(["notes"], "readwrite");
  const store = tx.objectStore("notes");
  const note = { npm, name, score };

  store.add(note);

  tx.oncomplete = () => getAndDisplayNotes(db);
  tx.onerror = event => alert("error storing note " + event.target.errorCode);
};

const submitNote = () => {
  let valueObj = {};

  [valueObj.npm, valueObj.name, valueObj.score] = [
    document.getElementById("npm").value,
    document.getElementById("name").value,
    document.getElementById("score").value
  ];

  addData(db, valueObj);

  [valueObj.npm, valueObj.name, valueObj.score] = ["", "", ""];
};

const displayNotes = notes => {
  let listHTML = "<ul>";

  for (const note of notes)
    listHTML +=
      "<li>" + note.text + " " + new Date(note.timestamp).toString() + "</li>";

  document.getElementById("notes").innerHTML = listHTML;
};

const getAndDisplayNotes = db => {
  let tx = db.transaction(["notes"], "readonly");
  let store = tx.objectStore("notes");

  let req = store.openCursor();
  let allNotes = [];

  req.onsuccess = event => {
    let cursor = event.target.result;

    if (cursor) {
      allNotes.push(cursor.value);
      cursor.continue();
    } else displayNotes(allNotes);
  };

  req.onerror = event => {
    alert("error cursor in request " + event.target.errorCode);
  };
};
