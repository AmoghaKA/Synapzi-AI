"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountCard } from "@/components/account-card";
import { demoProfile, loadUserProfile, saveUserProfile, type UserProfile } from "@/lib/synapzi";

const demoUserId = "demo-user";

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile>(demoProfile);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Your profile will appear here once it loads.");

  useEffect(() => {
    loadUserProfile(demoUserId).then((nextProfile) => {
      setProfile(nextProfile);
      setStatusMessage("Profile loaded. Update your account details and save changes.");
    });
  }, []);

  async function handleSave() {
    setBusy(true);
    setStatusMessage("Saving your profile...");
    try {
      await saveUserProfile(demoUserId, profile);
      setStatusMessage("Profile saved successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setStatusMessage(`Unable to save profile. ${message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Account" userName={profile.fullName || "Student"}>
      <AccountCard
        profile={profile}
        onChange={setProfile}
        onSave={handleSave}
        busy={busy}
        statusMessage={statusMessage}
      />
    </AppShell>
  );
}