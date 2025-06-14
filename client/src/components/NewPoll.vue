<template>
  <v-dialog v-model="isOpen" :width="mdAndUp ? '25vw' : '100vw'">
    <v-sheet>
      <v-form class="px-4 py-5 d-flex flex-column align-center">
        <v-text-field
          class="w-75"
          v-model="pollTitle"
          label="כותרת הסקר"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-for="(_, optionIndex) in pollOptions"
          :key="optionIndex"
          class="w-100 mb-3"
          align-center
          v-model="pollOptions[optionIndex]"
          :placeholder="`אפשרות ${optionIndex + 1}`"
          variant="solo"
          hide-details
          :append-icon="optionIndex + 1 <= 2 ? '' : 'mdi-close'"
          @click:append="removeOptionByIndex(optionIndex)"
        ></v-text-field>

        <v-btn flat icon="mdi-plus" class="mt-3" @click="addOption"></v-btn>

        <v-btn @click="submit" size="large" class="mt-5">הוסף סקר</v-btn>
        <p v-if="!isFormValid" class="text-h6 mt-3 text-red">
          משהו פה לא תקין חביבי
        </p>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { getAuth } from "firebase/auth";
import api from "../api/api";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/userStore";
import { useSnackbarStore } from "../stores/snackbarStore";

const { mdAndUp } = useDisplay();

const props = defineProps({
  isOpenProp: {
    type: Boolean,
    required: true,
  },
});

const { user } = storeToRefs(useUserStore());

const { displaySnackbar } = useSnackbarStore();

const emit = defineEmits(["closeDialog", "addPoll"]);

const isOpen = ref(false);
const isFormValid = ref(true);
const pollTitle = ref("");
const pollOptions = ref(["", ""]);

const removeOptionByIndex = (optionIndex) => {
  if (optionIndex !== 0) {
    pollOptions.value.splice(optionIndex, 1);
  }
};

const addOption = async () => {
  pollOptions.value.push("");
};

const notifyGroup = async () => {
  await api.notifications().send(
    {
      title: "סקר חדש עלה! תענו עליו זריז☺",
      body: pollTitle.value,
    },
    user.value.topic
  );
};

const submit = async () => {
  if (
    pollOptions.value.findIndex((value) => !value) !== -1 ||
    pollTitle.value === "" ||
    new Set(pollOptions.value).size !== pollOptions.value.length
  ) {
    isFormValid.value = false;
  } else {
    const createdBy = getAuth().currentUser.uid;

    const poll = {
      title: pollTitle.value,
      options: pollOptions.value.map((name) => ({ name, answers: [] })),
      createdBy,
      topic: user.value.topic,
    };
    try {
      emit("addPoll", { ...poll, id: (await api.polls().addPoll(poll)).id });
      notifyGroup();
      displaySnackbar("הסקר נוסף בהצלחה");
    } catch (err) {
      console.log(err);
    } finally {
      closeDialog();
    }
  }
};

const closeDialog = () => {
  pollOptions.value = ["", ""];
  isFormValid.value = true;
  pollTitle.value = "";
  emit("closeDialog");
};

watch(
  () => props.isOpenProp,
  () => {
    isOpen.value = props.isOpenProp;
  }
);
watch(isOpen, () => !isOpen.value && closeDialog());
</script>

<style lang="scss" scoped></style>
