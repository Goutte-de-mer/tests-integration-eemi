"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      error: "Email et mot de passe requis",
    };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Erreur de connexion",
      };
    }

    // Récupérer le cookie
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const authTokenMatch = setCookieHeader.match(/auth_token=([^;]+)/);
      if (authTokenMatch) {
        const token = authTokenMatch[1];

        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000, // 1 heure
          path: "/",
        });
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Erreur serveur, veuillez réessayer",
    };
  }

  return { success: true };
}

// Action pour logout
export async function logoutAction() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  redirect("/login");
}
