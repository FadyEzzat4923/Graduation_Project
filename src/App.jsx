import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import GuideMom from "./pages/GuideMom";
import ErrorPage from "./pages/ErrorPage";
import Login from "./components/Profile/Login";
import Signup from "./components/Profile/Signup";
import Verification from "./components/Profile/Verification";
import NewPassword from "./components/Profile/NewPassword";
import Changed from "./components/Profile/Changed";
import Chat from "./pages/Chat";
import Profile from "./components/Profile/Profile";
import VoiceRecognition from "./pages/VoiceRecognition";
import HomeIntro from "./components/Home/HomeIntro";
import Marketplace from "./pages/Marketplace";
import ItemView from "./pages/ItemView";
import CreateProduct from "./components/Marketplace/CreateProduct";
import MyMarket from "./pages/MyMarket";
import MarketFavorite from "./components/Marketplace/MyMarket/MarketFavorite";
import MyProducts from "./components/Marketplace/MyMarket/MyProducts";
import EditProfile from "./components/Profile/EditProfile";
import ForgetPassword from "./components/Profile/ForgetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomeIntro />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/guide-mom",
        element: <GuideMom />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/marketplace",
        element: <Marketplace />,
        children: [
          {
            path: "/marketplace/new-product",
            element: <CreateProduct />,
          },
        ],
      },
      {
        path: "/marketplace/:itemId",
        element: <ItemView />,
      },
      {
        path: "/voice-recognition",
        element: <VoiceRecognition />,
      },
      {
        path: "login",
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "reset",
            element: <ForgetPassword />,
          },
          {
            path: "check-email",
            element: <Verification />,
          },
          {
            path: "new-password",
            element: <NewPassword />,
          },
          {
            path: "changed",
            element: <Changed />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/my-market",
        element: <MyMarket />,
        children: [
          {
            index: true,
            element: <MyProducts />,
          },
          {
            path: "matket-favorite",
            element: <MarketFavorite />,
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
