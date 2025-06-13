import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();
const pinia = createPinia();
const app = createApp(App);

app.use(PrimeVue);
app.use(pinia);
app.use(vuetify);
app.mount("#app");

