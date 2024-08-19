// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { Provider } from "react-redux";
// import store from "./redux/store.js";
// import { Toaster } from "react-hot-toast";

// createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <StrictMode>
//       <App />
//       <Toaster />
//     </StrictMode>
//   </Provider>
// );

import ReactDOM from "react-dom/client"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persister=persistStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persister}>
  <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </PersistGate>
    
  </Provider>
);

