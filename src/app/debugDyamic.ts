"use client"; // optional if you want client logging too

export function debugDynamic(name: string, component: React.ReactNode) {
  if (typeof window === "undefined") {
    console.log(`[SERVER] Component/Page "${name}" rendered on server`);
  } else {
    console.log(`[CLIENT] Component/Page "${name}" rendered on client`);
  }
  return component;
}
