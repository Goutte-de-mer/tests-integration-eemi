"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const [success, setSuccess] = useState(false);
  return (
    <main className="p-10">
      {success ? (
        <h1 className="text-center text-3xl font-medium">Bienvenue !</h1>
      ) : (
        <LoginForm setSuccess={setSuccess} success={success} />
      )}
    </main>
  );
}
