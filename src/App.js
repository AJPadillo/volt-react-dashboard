import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "./routes";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="wrapper">
        <Sidebar />
        <div className="main">
          <Navbar />
          <Switch>
            {Routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            ))}
            <Redirect from="/" to="/dashboard" />
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
