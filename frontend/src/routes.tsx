"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import ProfilePage from "@/app/profile/page";
import PostsPage from "@/app/posts/page";
import SettingsPage from "@/app/settings/page";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}
