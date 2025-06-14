<script setup>
import { computed, ref, watch } from "vue";
import PollCard from "./PollCard.vue";
import NewPoll from "./NewPoll.vue";
import { onMounted } from "vue";
import api from "../api/api";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "../stores/snackbarStore";

const { user } = storeToRefs(useUserStore());
const polls = ref([]);
const usersInTopic = ref([]);
const { displaySnackbar } = useSnackbarStore();

const getPolls = async () => {
  polls.value = await api.polls().findAllInTopic();
};

const getUsersInTopic = async () => {
  usersInTopic.value = await api.users().findAllInTopic();
};

const changeTopic = async () => {
  await getPolls();
  await getUsersInTopic();
};

onMounted(async () => {
  await changeTopic();
});

watch(user, async ({ topic: newTopic }, { topic: oldTopic }) => {
  newTopic !== oldTopic && (await changeTopic());
});

const pollSearch = ref("");

const isCreatingPoll = ref(false);

const stopPollCreation = () => {
  isCreatingPoll.value = false;
};

const addPoll = (poll) => {
  polls.value.push(poll);
};

const deletePoll = async (pollId) => {
  polls.value = polls.value.filter(({ id }) => id !== pollId);
  await api.polls().deletPollById(pollId);
  displaySnackbar("הסקר נמחק בהצלחה");
};

const filteredPolls = computed(() =>
  polls.value.filter(({ title }) =>
    title.toLowerCase().includes(pollSearch.value.toLowerCase())
  )
);
</script>

<template>
  <v-row>
    <v-col cols="3">
      <v-btn @click="() => (isCreatingPoll = true)" icon="mdi-plus"></v-btn>
    </v-col>
    <v-col cols="8">
      <v-text-field
        width="75"
        density="compact"
        variant="solo"
        label="חפש סקר"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        v-model="pollSearch"
      ></v-text-field>
    </v-col>
  </v-row>
  <Suspense>
    <poll-card
      v-if="polls.length > 0"
      v-for="poll in filteredPolls"
      :key="poll.id"
      :poll="poll"
      :users="usersInTopic"
      @delete-poll="deletePoll"
    />
  </Suspense>
  <new-poll
    @close-dialog="stopPollCreation"
    :isOpenProp="isCreatingPoll"
    @add-poll="addPoll"
  />
</template>
