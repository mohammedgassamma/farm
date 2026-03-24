// utils/DebugDynamic.tsx
import React from "react";

interface DebugDynamicProps {
  name: string;
  children: React.ReactNode;
}

export function DebugDynamic({ name, children }: DebugDynamicProps) {
  if (typeof window === "undefined") {
    // running on the server
    console.log(`[SERVER] Component/Page "${name}" rendered on server`);
  } else {
    // running on the client
    console.log(`[CLIENT] Component/Page "${name}" rendered on client`);
  }

  return <>{children}</>;
}
