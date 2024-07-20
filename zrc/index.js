"use strict";

import { render } from "z-js-framework";
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
