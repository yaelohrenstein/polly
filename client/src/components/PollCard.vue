<script setup>
import { ref } from "vue";
import api from "../api/api";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/userStore";
import { useRegistrationToken } from "../composables/token";
import { useSnackbarStore } from "../stores/snackbarStore";

const { mdAndUp } = useDisplay();
const props = defineProps({
  poll: {
    type: Object,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deletePoll"]);

const reveal = ref(false);
const show = ref(false);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { getToken } = useRegistrationToken(userStore);

const { displaySnackbar } = useSnackbarStore();

const didUserAnswerOption = (option, userId) => {
  return option.answers.findIndex(({ id }) => userId === id) !== -1;
};

const unAnsweredUsers = computed(() =>
  props.users.filter(
    ({ id }) =>
      props.poll.options.findIndex((option) =>
        didUserAnswerOption(option, id)
      ) === -1
  )
);

const userSelectedOptions = ref(
  props.poll.options
    .filter((option) => didUserAnswerOption(option, user.value.id))
    .map(({ name }) => name)
);

const selectOption = (option) => {
  const updatedPoll = { ...props.poll };
  const updatedOption = updatedPoll.options.find(
    ({ name }) => name === option.name
  );

  if (!userSelectedOptions.value.includes(option.name)) {
    updatedOption.answers.push(user.value);
  } else {
    updatedOption.answers = updatedOption.answers.filter(
      ({ id }) => id !== user.value.id
    );
  }

  api.polls().updatePoll(updatedPoll);
};

const notifyUnansweredUsers = async () => {
  try {
    await api.notifications().sendSpecificUsers(
      {
        title: "תענה כבר על הסקר יחאפר",
        body: `הסקר: ${props.poll.title}`,
      },

      unAnsweredUsers.value
        .filter(
          ({ registrationToken }) =>
            registrationToken &&
            registrationToken !== user.value.registrationToken
        )
        .map(({ registrationToken }) => registrationToken),
      getToken
    );

    displaySnackbar("הצקת להם בהצלחה");
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <v-card class="mx-auto my-12 pl-3" :width="mdAndUp ? '25vw' : '75vw'">
    <v-card-title class="d-flex justify-space-between"
      ><span><v-icon class="ml-3">mdi-poll</v-icon>{{ props.poll.title }}</span>
      <section>
        <v-btn
          v-if="props.poll.createdBy === user.id"
          icon="mdi-delete"
          @click="emit('deletePoll', props.poll.id)"
          flat
        ></v-btn>
        <v-btn
          v-if="props.poll.createdBy === user.id"
          @click="notifyUnansweredUsers"
          icon="mdi-bell"
          flat
        ></v-btn></section
    ></v-card-title>
    <v-divider></v-divider>
    <v-card-actions class="d-flex flex-column align-start">
      <v-row class="w-100">
        <v-col cols="auto">
          <v-checkbox
            v-for="option in props.poll.options"
            color="red"
            :label="option.name"
            :value="option.name"
            v-model="userSelectedOptions"
            @click="selectOption(option)"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-spacer></v-spacer>
        <v-col dir="ltr">
          <v-btn
            @click="reveal = true"
            icon="mdi-format-list-bulleted-square"
          ></v-btn>
        </v-col>
      </v-row>
      <v-btn @click="show = !show">מי לא ענה על הסקר?</v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-if="show && props.users">
        <v-divider></v-divider>

        <v-card-item
          v-if="unAnsweredUsers.length"
          v-for="{ id, img, displayName } in unAnsweredUsers"
          :key="id"
          :prepend-avatar="img"
          :title="displayName"
        >
        </v-card-item>
        <v-card-title class="text-center" v-else>היידה כולם ענו</v-card-title>
      </div>
    </v-expand-transition>

    <v-expand-x-transition>
      <v-card
        v-if="reveal"
        class="mx-auto v-card--reveal"
        :width="mdAndUp ? '25vw' : '75vw'"
      >
        <v-sheet class="h-100 d-flex align-center justify-space-between">
          <v-card-item class="w-75">
            <v-card-title class="w-100" v-for="option in props.poll.options">
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <span class="ml-1" v-bind="props">
                    <v-icon class="mb-1">mdi-account-multiple</v-icon>
                    {{ option.name }}
                  </span>
                </template>
                <span
                  >{{
                    Math.floor(
                      (option.answers.length / props.users.length) * 100
                    )
                  }}%</span
                >
              </v-tooltip>

              <v-tooltip
                v-for="answer in option.answers"
                :key="answer.displayName"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <v-avatar
                    class="mr-1"
                    :image="answer.img"
                    size="25"
                    v-bind="props"
                  ></v-avatar>
                </template>
                <span>{{ answer.displayName }}</span>
              </v-tooltip>
            </v-card-title>
          </v-card-item>
          <v-card-actions class="h-100 d-flex align-center justify-end w-25">
            <v-btn
              icon="mdi-chevron-right"
              color="red"
              @click="reveal = false"
              size="x-large"
            >
            </v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-expand-x-transition>
  </v-card>
</template>

<style scoped>
.v-card--reveal {
  top: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
