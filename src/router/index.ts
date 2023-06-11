import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import("@/views/Index.vue"),
  },
  {
    path: "/add",
    name: "addIndex",
    component: () =>
      import("../views/AddIndex.vue"),
    redirect: "/add/bookKeepingAdd",
    children: [
      {
        path: "bookKeepingAdd",
        name: "bookKeeping",
        component: () =>
          import(
            "../views/bookKeeping/bookKeepingAdd.vue"
          ),
      },
      {
        path: "stockAdd",
        name: "stock",
        component: () =>
          import("../views/stock/stockAdd.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(
        "../views/login/loginMethods/ToLogin.vue"
      ),
    redirect: "/login/byUser",
    children: [
      {
        path: "byUser",
        name: "byUser",
        component: () =>
          import(
            "../views/login/loginMethods/userLogin.vue"
          ),
      },
    ],
  },
  {
    path: "/setting",
    name: "setting",
    component: () =>
      import("../views/login/setting.vue"),
  },
  {
    path: "/review",
    name: "review",
    component: () =>
      import("../views/custom/review.vue"),
  },
  {
    path: "/love",
    name: "love",
    component: () =>
      import("../views/custom/love.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default routes;
