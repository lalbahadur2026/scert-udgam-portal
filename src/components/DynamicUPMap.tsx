"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { interpolateTurbo } from "d3-scale-chromatic"; 

// Fix for default marker icons if needed (though we only use polygons)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const districtMap: Record<string, string> = {
  "आगरा": "Agra",
  "अलीगढ़": "Aligarh",
  "प्रयागराज": "Prayagraj", 
  "इलाहाबाद": "Prayagraj", 
  "अंबेडकर नगर": "Ambedkar Nagar",
  "अमेठी": "Amethi",
  "अमरोहा": "Amroha",
  "औरैया": "Auraiya",
  "अयोध्या": "Ayodhya", 
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
  "भदोही": "Bhadohi", 
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
  "खीरी": "Kheri", 
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
  "शामली": "Shamli", 
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
  if (/^[a-zA-Z\s]+$/.test(trimmed)) {
      const match = Object.values(districtMap).find(d => d.toLowerCase() === trimmed.toLowerCase());
      return match || trimmed;
  }
  return districtMap[trimmed] || trimmed;
};

export default function DynamicUPMap({ districtStats, onDistrictClick }: { districtStats: { name: string, value: number }[], onDistrictClick?: (district: string) => void }) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/up_geojson.json")
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  const dataMap = React.useMemo(() => {
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

  const getColor = (d: number) => {
    if (d === 0) return "#f8fafc"; 
    // Turbo gives nice blue->green->yellow->red. 
    // We start at 0.1 and end at 0.9 to avoid the extremes.
    return interpolateTurbo(0.1 + (d / maxVal) * 0.8);
  };

  const style = (feature: any) => {
    const districtName = feature.properties.district;
    const normalizedDName = districtName ? districtName.toLowerCase() : "";
    const val = dataMap.get(normalizedDName) || 0;
    
    return {
      fillColor: getColor(val),
      weight: 1,
      opacity: 1,
      color: "#94a3b8", // border
      fillOpacity: val > 0 ? 0.7 : 0.4
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const districtName = feature.properties.district;
    const normalizedDName = districtName ? districtName.toLowerCase() : "";
    const val = dataMap.get(normalizedDName) || 0;
    
    // Always visible text label
    layer.bindTooltip(
      `<div style="text-align: center; font-size: 9px; font-weight: bold; color: #1e293b; text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;">
         ${districtName}<br/><span style="color:#2563eb;">(${val})</span>
       </div>`,
      { 
        permanent: true, 
        direction: "center",
        className: "district-tooltip-label" 
      }
    );

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#1e293b',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#94a3b8',
          fillOpacity: val > 0 ? 0.7 : 0.4
        });
      },
      click: () => {
        if (onDistrictClick) {
          // Pass the English normalized name so we can filter robustly
          onDistrictClick(normalizedDName);
        }
      }
    });
  };

  if (!geoData) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>नक्शा लोड हो रहा है...</div>;
  }

  return (
    <>
      <style>{`
        .district-tooltip-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0;
        }
        .district-tooltip-label::before {
          display: none !important;
        }
        .leaflet-tooltip-pane {
           z-index: 600;
        }
      `}</style>
      <MapContainer 
        center={[27.2, 80.5]} 
        zoom={6} 
        style={{ height: "450px", width: "100%", borderRadius: "8px", zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON 
          data={geoData} 
          style={style} 
          onEachFeature={onEachFeature} 
        />
      </MapContainer>
    </>
  );
}
