<template>
  <home v-if="user && !loading" />
  <v-sheet
    v-else-if="!user && !loading"
    class="d-flex flex-column justify-center align-center"
    height="100vh"
  >
    <v-img
      src="/logo-512.png"
      inline
      class="mb-4"
      :width="mdAndUp ? '25vw' : '75vw'"
    />
    <v-btn
      prepend-icon="mdi-google"
      color="red"
      :width="mdAndUp ? '25vw' : '50vw'"
      @click="signIn"
      >sign in</v-btn
    >
  </v-sheet>
  <circle-loader v-else></circle-loader>
  <v-snackbar
    :timeout="2000"
    color="#b40000"
    elevation="24"
    v-model="isDisplaying"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script setup>
import "./firebase/firebase";
import api from "./api/api";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { ref } from "vue";
import Home from "./views/Home.vue";
import CircleLoader from "./components/CircleLoader.vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "./stores/userStore";
import { useSnackbarStore } from "./stores/snackbarStore";

import { storeToRefs } from "pinia";

const { mdAndUp } = useDisplay();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { setUser } = userStore;

const snackbarStore = useSnackbarStore();
const { isDisplaying, snackbarMessage } = storeToRefs(snackbarStore);

const loading = ref(true);
const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loading.value = true;

    const currentUser = {
      id: user.uid,
      displayName: user.displayName,
      img: user.photoURL,
      topic: await api.users().getUserTopic(),
    };

    await api.users().addUser(currentUser);

    setUser(currentUser);
  }

  loading.value = false;
});

const signIn = async () => {
  try {
    signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
}
</style>
