"use client";

import dynamic from "next/dynamic";

const DynamicUPMap = dynamic(() => import("./DynamicUPMap"), {
  ssr: false,
  loading: () => <div style={{ height: "450px", display: "flex", justifyContent: "center", alignItems: "center" }}>नक्शा लोड हो रहा है...</div>
});

export default function UPMap({ districtStats, onDistrictClick }: { districtStats: { name: string, value: number }[], onDistrictClick?: (district: string) => void }) {
  return <DynamicUPMap districtStats={districtStats} onDistrictClick={onDistrictClick} />;
}
