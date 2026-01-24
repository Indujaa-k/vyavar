import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollIntoView from "./components/Scrollintoview";
import AppContent from "./appContent";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <ScrollIntoView>
          <AppContent />
        </ScrollIntoView>
      </Router>
    </ChakraProvider>
  );
};

export default App;
