import api from "../api/api";
import { getNotificationToken } from "../firebase/firebase";

export const useRegistrationToken = (userStore) => {
  const { updateUser, user } = userStore;

  const getToken = async () => {
    const token = await getNotificationToken();

    updateUser({ token });
    api.users().updateUserRegistrationToken(user.id, token);

    return token;
  };

  return { getToken };
};
