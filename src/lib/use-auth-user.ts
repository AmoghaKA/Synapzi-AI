"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseServices } from "@/lib/firebase";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getFirebaseServices()));

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      return;
    }

    return onAuthStateChanged(services.auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
