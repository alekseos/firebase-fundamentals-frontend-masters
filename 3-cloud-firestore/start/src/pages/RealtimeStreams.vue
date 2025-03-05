<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { onBeforeUnmount, onMounted, reactive } from "vue";
import UserExcersize from "../components/UserExcersize.vue";
import { getFirebase } from "../firebase";

const { firestore } = getFirebase();
const usersCol = collection(firestore, "users");

const state = bindToTable(usersCol);

function bindToTable(expensesQuery) {
  const state = reactive({ results: [] });
  let subscription = null;
  onMounted(() => {
    subscription = bindToState(state, expensesQuery);
  });
  onBeforeUnmount(() => {
    subscription();
  });
  return state;
}

function bindToState(state, query, transform = formatUser) {
  // 1. Create a realtime listener
  onSnapshot(usersCol, (snapshot) => {
    state.results = snapshot.docs.map(formatUser);
  });
}

function formatUser(docSnapshot) {
  // 2. Transform the object returned
  return {
    uId: docSnapshot.id,
  };
}
</script>

<template>
  <main>
    <UserExcersize
      number="1"
      subtitle="Reading data"
      :results="state.results"
    />
  </main>
</template>

<style></style>
