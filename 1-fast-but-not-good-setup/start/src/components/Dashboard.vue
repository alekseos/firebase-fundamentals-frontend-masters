<script setup>
import { onBeforeMount, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { config } from "../config";

const firebaseApp = initializeApp(config.firebase);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const markdownsCol = collection(firestore, "markdowns");

const state = reactive({ markdowns: [] });
const router = useRouter();

onBeforeMount(async () => {
  // Get a user

  state.user = auth.currentUser;
  console.log(1, auth.currentUser);
});

onMounted(() => {
  onSnapshot(markdownsCol, (snapshot) => {
    state.markdowns = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
});

function newMarkdown() {
  const newId = Math.random().toString(36).substr(2, 5);
  const newDoc = doc(markdownsCol);
  setDoc(newDoc, { markdown: "", converted: "" });
  router.push(`/editor/${newDoc.id}`);
}
</script>

<template>
  <h1>I am the dashboard</h1>

  <ul v-for="markdown in state.markdowns" :key="markdown.id">
    <li>
      <router-link :to="{ path: `/editor/${markdown.id}` }">{{
        markdown.id
      }}</router-link>
    </li>
  </ul>

  <button @click="newMarkdown">New</button>
</template>
