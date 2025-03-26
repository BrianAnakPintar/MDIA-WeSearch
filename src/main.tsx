import { Provider } from "@/components/ui/provider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Upload from "./routes/upload.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ColorModeProvider } from "@/components/ui/color-mode";
import Post from "./routes/post.tsx";
import NotFound from "./routes/error404.tsx";
import Home from "./routes/home.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <Home /> },
  { path: "/upload", element: <Upload /> },
  { path: "/post/:id", element: <Post /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ColorModeProvider forcedTheme="light">
        <RouterProvider router={router} />
      </ColorModeProvider>
    </Provider>
  </StrictMode>,
);
