import React from "react"
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

import App from "./App"

import LobbyPage from "../pages/LobbyPage"
import GamePage from "../pages/GamePage"
import ProfilePage from "../pages/ProfilePage"
import LeaderboardPage from "../pages/LeaderboardPage"
import NotFoundPage from "../pages/NotFoundPage"


/*
APP ROUTES
*/

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      {
        index: true,
        element: <LobbyPage />
      },

      {
        path: "game",
        element: <GamePage />
      },

      {
        path: "profile",
        element: <ProfilePage />
      },

      {
        path: "leaderboard",
        element: <LeaderboardPage />
      },

      {
        path: "*",
        element: <NotFoundPage />
      }

    ]
  }
])


/*
ROUTER PROVIDER
*/

export function AppRoutes() {

  return <RouterProvider router={router} />

}
