<script setup>
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { config } from "../config";
import { snarkdownEnhanced as snarkdown } from "../util";

const firebaseApp = initializeApp(config.firebase);
const firestore = getFirestore(firebaseApp);
const markdownsCol = collection(firestore, "markdowns");
const route = useRoute();
const state = reactive({});
const markdownsDoc = doc(markdownsCol, route.params.id);

onMounted(() => {
  onSnapshot(markdownsDoc, (snapshot) => {
    const data = snapshot.data();
    state.converted = data.converted;
    state.markdown = data.markdown;
  });
});

function convert(event) {
  const markdown = event.target.value;
  const converted = snarkdown(markdown);
  setDoc(markdownsDoc, { converted, markdown });
}
</script>

<template>
  <h3>Editor</h3>
  <router-link to="/dashboard">&lt; Dashboard</router-link>
  <div id="editor">
    <textarea @keyup="convert" v-model="state.markdown"></textarea>
    <div class="output" v-html="state.converted"></div>
  </div>
</template>

<style>
#editor {
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
  margin-block-start: 8px;
  height: 100vh;
}
#editor h1,
#editor h2,
#editor h3,
#editor h4,
#editor h5 {
  margin-block-end: 8px;
}
#editor .output p {
  line-height: 1.5;
  margin-block-end: 12px;
}
</style>
