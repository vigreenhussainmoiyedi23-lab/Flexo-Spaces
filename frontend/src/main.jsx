import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ListingContextProvider } from "./features/listings/listing.context.jsx";
import { ProfileContextProvider } from "./features/Profile/profile.context.jsx";
import SwapContextProvider from "./features/swap/swap.context.jsx";
import ChatContextProvider from "./features/chats/chat.context.jsx";
import AdminContextProvider from "./features/admin/admin.context.jsx";
import NotificationProvider from "./features/notifications/notification.context.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <ListingContextProvider>
        <ProfileContextProvider>
          <SwapContextProvider>
            <ChatContextProvider>
              <AdminContextProvider>
                <NotificationProvider>
                  <StrictMode>
                    <App />
                  </StrictMode>
                </NotificationProvider>
              </AdminContextProvider>
            </ChatContextProvider>
          </SwapContextProvider>
        </ProfileContextProvider>
      </ListingContextProvider>
    </AuthProvider>
  </GoogleOAuthProvider>,
);
