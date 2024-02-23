// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import * as Firestore from "firebase/firestore"
import { IProject } from "../class/Project";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9qjUZxMhHXS5QFshXo6lpSxsXK2jtri8",
  authDomain: "bim-dev-master-d1f0f.firebaseapp.com",
  projectId: "bim-dev-master-d1f0f",
  storageBucket: "bim-dev-master-d1f0f.appspot.com",
  messagingSenderId: "1041193382103",
  appId: "1:1041193382103:web:1410579ad963c0ca3ac092"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDB = Firestore.getFirestore()

export function getCollection<T>(path: string){
    return Firestore.collection(firebaseDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path:string, id:string){
    const doc = Firestore.doc(firebaseDB,`${path}/${id}`)
    await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id:string, data: T){
    const doc = Firestore.doc(firebaseDB,`${path}/${id}`)
    await Firestore.updateDoc(doc, data)
}

export async function createDocument<T>(path:string, data: T){
    const projectsCollection = getCollection<T>(path)
    await Firestore.addDoc(projectsCollection, data)
}

//updateDocument<Partial<IProject>>("/projects", "id", {name:"New Project Name"})