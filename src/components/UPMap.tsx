"use client";

import dynamic from "next/dynamic";

const DynamicUPMap = dynamic(() => import("./DynamicUPMap"), {
  ssr: false,
  loading: () => <div style={{ height: "450px", display: "flex", justifyContent: "center", alignItems: "center" }}>नक्शा लोड हो रहा है...</div>
});

export default function UPMap({ districtStats }: { districtStats: { name: string, value: number }[] }) {
  return <DynamicUPMap districtStats={districtStats} />;
}
