import { getAuth } from "firebase/auth";
import { db, getNotificationToken } from "../firebase/firebase";
import axios from "./axiosInstance";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRegistrationToken } from "../composables/token";

const docsToList = (docs) => {
  const items = [];

  docs.forEach((doc) => {
    items.push({ ...doc.data(), id: doc.id });
  });

  return items;
};

const getAllInTopic = async (collectionName, topic) => {
  const requestedTopic =
    topic || (await api.users().getUserTopic(getAuth().currentUser.uid));

  const collectionData = docsToList(
    await getDocs(collection(db, collectionName))
  );

  return collectionData.filter(({ topic }) => requestedTopic === topic);
};

const api = {
  polls() {
    return {
      async findAll() {
        return docsToList(await getDocs(collection(db, "polls")));
      },
      async findAllInTopic() {
        return getAllInTopic("polls");
      },
      async addPoll(poll) {
        return addDoc(collection(db, "polls"), poll);
      },
      async updatePoll(poll) {
        const pollRef = doc(db, "polls", poll.id);
        const pollSnapshot = await getDoc(pollRef);

        pollSnapshot.exists() &&
          (await setDoc(doc(db, "polls", poll.id), poll, { merge: true }));
      },
      async deletPollById(pollId) {
        await deleteDoc(doc(db, "polls", pollId));
      },
    };
  },
  users() {
    return {
      async findAll() {
        return docsToList(await getDocs(collection(db, "users")));
      },
      async findAllInTopic() {
        return getAllInTopic("users");
      },
      async getByIds(ids) {
        const q = query(collection(db, "users"), where("id", "in", ids));
        return docsToList(await getDocs(q));
      },
      async getUserTopic() {
        return (await this.doesUserExist(getAuth().currentUser.uid))
          ? (await getDoc(doc(db, "users", getAuth().currentUser.uid))).data()
              .topic
          : null;
      },
      async doesUserExist(userId) {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        return userSnapshot.exists();
      },
      async addUser(user) {
        !(await this.doesUserExist(user.id)) &&
          (await setDoc(doc(db, "users", user.id), user));
      },
      async updateUserTopic(userId, topic) {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
          topic,
        });
      },
      async updateUserRegistrationToken(userId, registrationToken) {
        if (registrationToken) {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            registrationToken,
          });
        }
      },
    };
  },
  topics() {
    return {
      async findAll() {
        return docsToList(await getDocs(collection(db, "topics")));
      },
      async changeTopic(path) {
        axios.post(path, {
          token: await getNotificationToken(),
        });
      },
      subscribeTopic(topic) {
        this.changeTopic(`/subscribe/${topic}`);
      },
      unsubscribeTopic(topic) {
        this.changeTopic(`/unsubscribe/${topic}`);
      },
      changeSubscription(topicFrom, topicTo) {
        this.changeTopic(`/change-subscription/${topicFrom}/${topicTo}`);
      },
    };
  },
  notifications() {
    return {
      async send(notification, topic) {
        const message = {
          data: {
            ...notification,
            image: getAuth().currentUser.photoURL,
            click_action: "https://pollys-server.fly.dev",
          },
          topic,
        };

        axios.post(`/send-topic`, { message });
      },
      async sendSpecificUsers(notification, tokens, getToken) {
        await getToken();

        const message = {
          data: {
            ...notification,
            image: getAuth().currentUser.photoURL,
            click_action: "https://pollys-server.fly.dev",
          },
          tokens,
        };

        axios.post(`/send-group`, { message });
      },
    };
  },
};

export default api;
