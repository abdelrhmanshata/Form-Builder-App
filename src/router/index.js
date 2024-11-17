import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import EditFormPage from "../pages/EditFormPage.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: HomePage,
    meta: { title: "Home Page" },
  },
  {
    name: "edit",
    path: "/edit",
    component: EditFormPage,
    meta: { title: "Home Page" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
