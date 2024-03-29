import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Socket from "socket.io-client";

import { WEBSOCKET_SERVER_URL } from "@/globals/constants.ts";
import ClientPeerProvider from "@/providers/ClientPeerProvider.tsx";
import RoomContextProvider from "@/providers/RoomContextProvider.tsx";
import SocketContextProvider from "@/providers/SocketContextProvider.tsx";
import Client from "@/routes/client";
import Initiator from "@/routes/initiator";
import Layout from "@/routes/Layout.tsx";
import Rooms from "@/routes/rooms";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export enum Routes {
    ROOT = "/",
    GAMES = "/games",
    ROOMS = "/rooms",
    CLIENT = "/client",
    INITIATOR = "/initiator",
}

const io = Socket(WEBSOCKET_SERVER_URL);

const router = createBrowserRouter([
    {
        path: Routes.ROOT,
        element: <Layout />,
        children: [
            {
                path: Routes.ROOMS,
                element: <Rooms />,
            },
            {
                path: Routes.GAMES,
                element: <div>Games</div>,
            },
            {
                path: Routes.CLIENT,
                element: <Client />,
            },
            {
                path: Routes.INITIATOR,
                element: <Initiator />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <SocketContextProvider io={io}>
            <RoomContextProvider>
                <ClientPeerProvider>
                    <RouterProvider router={router} />
                </ClientPeerProvider>
            </RoomContextProvider>
        </SocketContextProvider>
    </QueryClientProvider>
    // </React.StrictMode>
);
