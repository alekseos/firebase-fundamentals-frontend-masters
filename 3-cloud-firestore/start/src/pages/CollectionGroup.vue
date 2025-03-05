<script setup>
import { collection, collectionGroup, onSnapshot } from "firebase/firestore";
import { onBeforeUnmount, onMounted, reactive } from "vue";
import ExpenseExcersize from "../components/ExpenseExcersize.vue";
import { getFirebase } from "../firebase";

const { firestore } = getFirebase();
const expensesCol = collection(firestore, "expenses");
const expensesColGroup = collectionGroup(firestore, "expenses");
let expensesQuery = null;

// // 1. Get the first 100 expenses across all users that are under $100
expensesQuery = expensesColGroup;

// // 2. Get the first 100 expenses across all users from any date range
// expensesQuery = query(
//   expensesColGroup,
//   limit(100),
//   where("date", "==", new Date("12/08/2021"))
// );

const state = bindToTable(expensesQuery);

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

function bindToState(state, query, transform) {
  return onSnapshot(query, (snapshot) => {
    const callbackFn = transform == null ? formatExpense : transform;
    state.results = snapshot.docs.map((d) => {
      return callbackFn(snapshot, d);
    });
  });
}

function formatExpense(snapshot, d) {
  const { uid, cost, categories, date: rawDate } = d.data();
  const dateConfig = { day: "2-digit", month: "2-digit", year: "numeric" };
  const date = new Intl.DateTimeFormat("en", dateConfig).format(
    rawDate.toDate()
  );
  const { fromCache } = snapshot.metadata;
  return { uid, cost, categories: categories.join(", "), fromCache, date };
}
</script>

<template>
  <main>
    <ExpenseExcersize
      number="2"
      subtitle="The basics of querying"
      :results="state.results"
    />
  </main>
</template>

<style></style>
