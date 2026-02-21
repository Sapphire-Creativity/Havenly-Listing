"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";

const ClientDashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  console.log(user);

  if (!isLoaded) return;
  return (
    <div>
      Client Dashboard
      <h2>Hello {user.unsafeMetadata.fullName}</h2>

      <h3>{user.unsafeMetadata.role}</h3>
    </div>
  );
};

export default ClientDashboard;
