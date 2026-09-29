import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";

import './index.css'

import App from "./App.tsx";
import Public from "./Public.tsx";

import {LoginPage} from "./pages/auth/login.page.tsx";
import {RegisterPage} from "./pages/auth/register.page.tsx";
import {HomePage} from "./pages/app/home.page.tsx";
import {ProfilePage} from "./pages/app/profile.page.tsx";


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <Routes>
          <Route element={<Public />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route element={<App />}>
              <Route path="/" element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
          </Route>
      </Routes>
  </BrowserRouter>
)
