
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, Timestamp, getDocs, doc, deleteDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeMznBfeuf2X8po9VJShQw3Xjul3KFj2E",
  authDomain: "addtodo-d9e95.firebaseapp.com",
  projectId: "addtodo-d9e95",
  storageBucket: "addtodo-d9e95.firebasestorage.app",
  messagingSenderId: "1065470514997",
  appId: "1:1065470514997:web:21d80ea55de34da4589e7c",
  measurementId: "G-6ZHMT2N35N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let getOl = document.getElementById("ol");

async function addTodo() {
  try {
    getOl.innerHTML = ""; 
    let getInp = document.getElementById("add-items");

    const docRef = await addDoc(collection(db, "todos"), {
      items: getInp.value,
      createdAt: Timestamp.now(),
    });

    console.log("Document written with ID: ", docRef.id);
    getInp.value = ""; 
    readData(); 
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

window.addTodo = addTodo;

async function readData() {
  const querySnapshot = await getDocs(collection(db, "todos"));
  getOl.innerHTML = ""; 

  querySnapshot.forEach((doc) => {
    getOl.innerHTML += `
      <li>${doc.data().items} 
        <button onclick='delTodo("${doc.id}")'>Delete</button> 
        <button onclick='editTodo("${doc.id}")'>Edit</button>
      </li><br>
    `;
  });
}

readData();

async function delTodo(id) {
  await deleteDoc(doc(db, "todos", id)); 
  console.log("Document deleted with ID: ", id);
  readData(); 
}

window.delTodo = delTodo;

async function editTodo(id) {
  const editItem = prompt("Enter updated item");
  if (editItem) {
    const docRef = doc(db, "todos", id);
    await updateDoc(docRef, {
      items: editItem,
      createdAt: Timestamp.now(),
    });
    readData(); 
  }
}

window.editTodo = editTodo;

async function delTodos() {
  getOl.innerHTML = ""; 
  const querySnapshot = await getDocs(collection(db, "todos"));
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log("All items have been deleted");
  readData(); 
}

window.delTodos = delTodos;
