"use strict";

import { render } from "../node_modules/z-js-framework/dist/z.js";
import Home from "./pages/home.js";

const root = document.querySelector("#root");

const routes = [
  {
    route: "/",
    component: Home,
  },
];

// render the app
render(root, routes);
