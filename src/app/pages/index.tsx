// pages/index.tsx
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import PostTable from "../components/PostList";

const App = () => (
  <ChakraProvider>
    <PostTable />
  </ChakraProvider>
);

export default App;
