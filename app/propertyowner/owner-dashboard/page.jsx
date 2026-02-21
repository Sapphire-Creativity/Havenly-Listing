"use client"

import React from "react";

import { useUser } from "@clerk/nextjs";
export default function OwnerDashboard () {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return;
  console.log(user)
  return (
    <div>
      Owner Dashboard
      <h2>Hello {user?.fullName}!</h2>
    </div>
  );
};

 
