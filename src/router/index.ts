import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import store from "@/store";
import { Mutations, Actions } from "@/store/enums/StoreEnums";
import JwtService from "@/core/services/JwtService";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    // meta: {
    //   middleware: "auth",
    // },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/product-requisitions",
        name: "productRequisitions",
        component: () => import("@/views/productRequisition/Index.vue"),
        meta: {
          pageTitle: "Product Requisition",
          breadcrumbs: ["List"],
        },
      },
      {
        path: "/product-requisitions/create",
        name: "productRequisitionsCreate",
        component: () => import("@/components/productRequisition/Create.vue"),
        meta: {
          pageTitle: "Create Product Requisition",
          breadcrumbs: ["Create"],
        },
      },
      {
        path: "/product-requisitions/update/:product_requisition_id",
        name: "productRequisitionsUpdate",
        component: () => import("@/components/productRequisition/Update.vue"),
        meta: {
          pageTitle: "Update Product Requisition",
          breadcrumbs: ["Update"],
        },
      },
      {
        path: "/product-requisitions/details/:product_requisition_id",
        name: "productRequisitionsDetails",
        component: () => import("@/components/productRequisition/Details.vue"),
        meta: {
          pageTitle: "Details Product Requisition",
          breadcrumbs: ["Details"],
        },
      },
      {
        path: "/product-requisitions/issues",
        name: "productRequisitionsIssues",
        component: () => import("@/views/productRequisition/Issue.vue"),
        meta: {
          pageTitle: "Product Requisition",
          breadcrumbs: ["Issue List"],
        },
      },
      {
        path: "/product-requisitions/issue-create/:product_requisition_id",
        name: "productRequisitionsIssueCreate",
        component: () => import("@/components/productRequisition/IssueCreate.vue"),
        meta: {
          pageTitle: "Issue Product Requisition",
          breadcrumbs: ["Issue"],
        },
      },
      {
        path: "/product-requisitions/issue-update/:product_requisition_id",
        name: "productRequisitionsIssueUpdate",
        component: () => import("@/components/productRequisition/IssueUpdate.vue"),
        meta: {
          pageTitle: "Issue Product Requisition",
          breadcrumbs: ["Issue"],
        },
      },
      {
        path: "/product-requisitions/issue-details/:product_requisition_id",
        name: "productRequisitionsIssueDetails",
        component: () => import("@/components/productRequisition/IssueDetails.vue"),
        meta: {
          pageTitle: "Issue Product Requisition",
          breadcrumbs: ["Issue"],
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // current page view title
  document.title = `${to.meta.pageTitle} - ${process.env.VUE_APP_NAME}`;

  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // verify auth token before each page change
  store.dispatch(Actions.VERIFY_AUTH, { api_token: JwtService.getToken() });

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (store.getters.isUserAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
