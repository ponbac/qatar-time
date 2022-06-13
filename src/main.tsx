import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./index.css";
import store from "./utils/store";
import Home from "./views";
import HallOfFame from "./views/halloffame";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout>
        {/* <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<Home />} />
              <Route path="halloffame" element={<HallOfFame />}>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter> */}
        <Home />
      </Layout>
    </Provider>
  </React.StrictMode>
);
