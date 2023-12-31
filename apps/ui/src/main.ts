import { createApp } from "vue";
import "./styles";
import App from "./App.vue";

import pinia from "@plugins/pinia";
import "@plugins/webfontloader";

const app = createApp(App);

app.use(pinia);

app.mount("#app");
