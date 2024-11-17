// import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";

// Router
import router from "./router";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // Optional for icons

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.mount("#app");
