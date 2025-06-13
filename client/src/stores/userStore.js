import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const updateUser = (userProperties) => {
    user.value = { ...user.value, ...userProperties };
  };

  return { user, setUser, updateUser };
});
