import React from "react";
import { Outlet } from "react-router";
import { Navbar } from "./parts/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
