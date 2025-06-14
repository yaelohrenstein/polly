<template>
  <v-select
    :class="`w-${mdAndUp ? 25 : 50}`"
    prepend-icon="mdi-account-group"
    density="compact"
    rounded
    variant="outlined"
    :items="topics"
    item-title="topic"
    label="קבוצות"
    v-model="userTopic"
  ></v-select>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../api/api";
import { getAuth } from "firebase/auth";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();

const props = defineProps({
  userTopic: {
    type: String,
  },
});

const emit = defineEmits(["changeTopic"]);
const topics = await api.topics().findAll();

const userTopic = ref(props.userTopic);

watch(userTopic, async (topic) => {
  if (topic) {
    api.users().updateUserTopic(getAuth().currentUser.uid, topic);

    emit("changeTopic", topic);
  }
});

watch(
  () => props.userTopic,
  (topic) => {
    userTopic.value = topic;
  }
);
</script>

<style lang="scss" scoped></style>
