<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card class="px-5">
      <v-card-title> לאיזה קבוצה אתם שייכים? </v-card-title>
      <v-card-actions>
        <Suspense> <topic-select @change-topic="changeTopic" /></Suspense>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import TopicSelect from "./TopicSelect.vue";

const emit = defineEmits(["changeTopic"]);
const dialog = ref(true);

const changeTopic = (newTopic) => {
  if (newTopic) {
    dialog.value = false;
    emit("changeTopic", newTopic);
  }
};
</script>

<style lang="scss" scoped></style>
