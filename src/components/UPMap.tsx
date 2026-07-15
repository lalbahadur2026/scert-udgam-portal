"use client";

import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "/uttarpradesh.json";

// Hindi to English district mapping based on standard UP districts
// This ensures that district names coming from the database match the TopoJSON features
const districtMap: Record<string, string> = {
  "आगरा": "Agra",
  "अलीगढ़": "Aligarh",
  "प्रयागराज": "Prayagraj", // Allahabad
  "इलाहाबाद": "Prayagraj", // Allahabad
  "अंबेडकर नगर": "Ambedkar Nagar",
  "अमेठी": "Amethi",
  "अमरोहा": "Amroha",
  "औरैया": "Auraiya",
  "अयोध्या": "Ayodhya", // Faizabad
  "फैजाबाद": "Ayodhya",
  "आजमगढ़": "Azamgarh",
  "बागपत": "Baghpat",
  "बहराइच": "Bahraich",
  "बलिया": "Ballia",
  "बलरामपुर": "Balrampur",
  "बांदा": "Banda",
  "बाराबंकी": "Barabanki",
  "बरेली": "Bareilly",
  "बस्ती": "Basti",
  "भदोही": "Bhadohi", // Sant Ravidas Nagar
  "बिजनौर": "Bijnor",
  "बदायूं": "Budaun",
  "बुलंदशहर": "Bulandshahr",
  "चंदौली": "Chandauli",
  "चित्रकूट": "Chitrakoot",
  "देवरिया": "Deoria",
  "एटा": "Etah",
  "इटावा": "Etawah",
  "फर्रुखाबाद": "Farrukhabad",
  "फतेहपुर": "Fatehpur",
  "फिरोजाबाद": "Firozabad",
  "गौतम बुद्ध नगर": "Gautam Buddha Nagar",
  "गाजियाबाद": "Ghaziabad",
  "गाजीपुर": "Ghazipur",
  "गोंडा": "Gonda",
  "गोरखपुर": "Gorakhpur",
  "हमीरपुर": "Hamirpur",
  "हापुड़": "Hapur",
  "हरदोई": "Hardoi",
  "हाथरस": "Hathras",
  "जालौन": "Jalaun",
  "जौनपुर": "Jaunpur",
  "झांसी": "Jhansi",
  "कन्नौज": "Kannauj",
  "कानपुर देहात": "Kanpur Dehat",
  "कानपुर नगर": "Kanpur Nagar",
  "कासगंज": "Kasganj",
  "कौशांबी": "Kaushambi",
  "खीरी": "Kheri", // Lakhimpur Kheri
  "लखीमपुर खीरी": "Kheri",
  "कुशीनगर": "Kushinagar",
  "ललितपुर": "Lalitpur",
  "लखनऊ": "Lucknow",
  "महाराजगंज": "Maharajganj",
  "महोबा": "Mahoba",
  "मैनपुरी": "Mainpuri",
  "मथुरा": "Mathura",
  "मऊ": "Mau",
  "मेरठ": "Meerut",
  "मिर्जापुर": "Mirzapur",
  "मुरादाबाद": "Moradabad",
  "मुजफ्फरनगर": "Muzaffarnagar",
  "पीलीभीत": "Pilibhit",
  "प्रतापगढ़": "Pratapgarh",
  "रायबरेली": "Raebareli",
  "रामपुर": "Rampur",
  "सहारनपुर": "Saharanpur",
  "संभल": "Sambhal",
  "संत कबीर नगर": "Sant Kabir Nagar",
  "शाहजहांपुर": "Shahjahanpur",
  "शामली": "Shamli", // Prabudh Nagar
  "श्रावस्ती": "Shravasti",
  "सिद्धार्थनगर": "Siddharthnagar",
  "सीतापुर": "Sitapur",
  "सोनभद्र": "Sonbhadra",
  "सुल्तानपुर": "Sultanpur",
  "उन्नाव": "Unnao",
  "वाराणसी": "Varanasi"
};

const normalizeDistrictName = (name: string) => {
  if (!name) return "";
  const trimmed = name.trim();
  // If it's already an English name (basic check), return it properly capitalized or mapped
  if (/^[a-zA-Z\s]+$/.test(trimmed)) {
      // Find case-insensitive match in values
      const match = Object.values(districtMap).find(d => d.toLowerCase() === trimmed.toLowerCase());
      return match || trimmed;
  }
  return districtMap[trimmed] || trimmed;
};

export default function UPMap({ districtStats }: { districtStats: { name: string, value: number }[] }) {
  const [tooltipContent, setTooltipContent] = useState("");

  const dataMap = useMemo(() => {
    const map = new Map();
    if (districtStats) {
      districtStats.forEach(d => {
        const engName = normalizeDistrictName(d.name).toLowerCase();
        map.set(engName, (map.get(engName) || 0) + d.value);
      });
    }
    return map;
  }, [districtStats]);

  const maxVal = Math.max(...Array.from(dataMap.values()), 1);

  const colorScale = scaleLinear<string>()
    .domain([0, maxVal])
    .range(["#eff6ff", "#1e3a8a"]); // Light blue to very dark blue

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3500,
          center: [80.5, 27.2] // Center of UP roughly
        }}
        width={600}
        height={400}
        style={{ width: "100%", height: "100%", maxHeight: "400px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const districtName = geo.properties.district;
              const normalizedDName = districtName ? districtName.toLowerCase() : "";
              const val = dataMap.get(normalizedDName) || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(`${districtName}: ${val} लेखन`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: val > 0 ? colorScale(val) : "#f1f5f9",
                      stroke: "#cbd5e1",
                      strokeWidth: 0.5,
                      outline: "none"
                    },
                    hover: {
                      fill: "#f59e0b", // Amber hover
                      stroke: "#d97706",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    },
                    pressed: {
                      fill: "#d97706",
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tooltipContent && (
        <div style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "0.8rem",
          pointerEvents: "none",
          zIndex: 10
        }}>
          {tooltipContent}
        </div>
      )}
      
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b' }}>
        <span>0</span>
        <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, #eff6ff, #1e3a8a)', borderRadius: '4px' }}></div>
        <span>{maxVal}</span>
      </div>
    </div>
  );
}
