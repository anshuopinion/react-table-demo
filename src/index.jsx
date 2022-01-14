import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import reactDom from "react-dom";
import App from "./App";

reactDom.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
