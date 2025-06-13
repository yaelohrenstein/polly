import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const isDisplaying = ref(false);
  const snackbarMessage = ref("");

  const displaySnackbar = (message) => {
    isDisplaying.value = true;
    snackbarMessage.value = message;
  };

  return { isDisplaying, snackbarMessage, displaySnackbar };
});
