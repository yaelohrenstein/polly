<template>
  <topic-dialog @change-topic="changeTopic" v-if="!user.topic" />
  <v-container class="w-100 d-flex flex-column" v-else>
    <Suspense>
      <topic-select
        class="align-self-center ml-5"
        :user-topic="user.topic"
        @change-topic="changeTopic"
    /></Suspense>
    <poll-list />
  </v-container>
</template>

<script setup>
import TopicDialog from "../components/TopicDialog.vue";
import TopicSelect from "../components/TopicSelect.vue";
import PollList from "../components/PollList.vue";
import api from "../api/api";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRegistrationToken } from "../composables/token";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { updateUser } = userStore;
const { getToken } = useRegistrationToken(userStore);

onMounted(() => {
  getToken();
});

const changeTopic = async (topic) => {
  if (!user.value.topic) {
    api.topics().subscribeTopic(topic, user.value.registrationToken);
  } else {
    api
      .topics()
      .changeSubscription(
        user.value.topic,
        topic,
        user.value.registrationToken
      );
  }

  updateUser({ topic });
  getToken();
};
</script>

<style lang="scss" scoped></style>
