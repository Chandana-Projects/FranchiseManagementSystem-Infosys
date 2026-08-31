"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Layers, Globe } from "lucide-react";
import { GLOBAL_LOCATIONS, LocationNode, haversineDistanceKm } from "../lib/GlobalLocationRegistry";
import { formatCurrencyValue, CurrencyCode } from "../lib/CurrencyEngine";

export { haversineDistanceKm };

interface RealOutletMapProps {
  selectedCountry?: string;
  selectedState?: string;
  accentColor?: string;
  theme?: any;
  activeCurrency?: CurrencyCode;
}

export default function RealOutletMap({
  selectedCountry = "All",
  selectedState = "All",
  accentColor = "#3B82F6",
  theme,
  activeCurrency = "INR",
}: RealOutletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<LocationNode | null>(GLOBAL_LOCATIONS[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tileStyle, setTileStyle] = useState<"dark" | "street">("dark");

  const puneHQ = GLOBAL_LOCATIONS[0];

  // Filter location nodes based on selection
  const filteredLocations = GLOBAL_LOCATIONS.filter((loc) => {
    const matchCountry = selectedCountry === "All" || loc.country === selectedCountry;
    const matchState = selectedState === "All" || loc.state === selectedState;
    return matchCountry && matchState;
  });

  const activeLocations = filteredLocations.length > 0 ? filteredLocations : GLOBAL_LOCATIONS;

  useEffect(() => {
    // Load Leaflet CSS dynamically if not present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const loadLeafletScript = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).L) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    let isMounted = true;

    loadLeafletScript().then(() => {
      if (!isMounted || !mapContainerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial center point
      const initialCenter: [number, number] =
        activeLocations.length > 0
          ? [activeLocations[0].lat, activeLocations[0].lng]
          : [20.5937, 78.9629];

      const initialZoom = selectedState !== "All" ? 8 : selectedCountry !== "All" ? 5 : 4;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Tile layer selection with error fallback
      const tileUrl =
        tileStyle === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);

      tileLayer.on("tileerror", () => {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);
      });

      // Pin Color Map
      const colorMap = {
        Healthy: "#10B981",
        Watch: "#F59E0B",
        Critical: "#FB7185",
      };

      // Render markers for active locations
      activeLocations.forEach((loc) => {
        const color = colorMap[loc.status];
        const distKm = haversineDistanceKm(puneHQ.lat, puneHQ.lng, loc.lat, loc.lng);

        const customIcon = L.divIcon({
          className: "custom-leaflet-pin",
          html: `
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              background: ${color};
              border: 2.5px solid #0F172A;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px ${color}80;
              cursor: pointer;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: #FFFFFF;
                border-radius: 50%;
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="
            font-family: system-ui, -apple-system, sans-serif;
            color: #0F172A;
            padding: 4px;
            min-width: 190px;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <strong style="font-size: 14px; font-weight: 700;">${loc.name}</strong>
              <span style="
                font-size: 10px;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 9999px;
                background: ${color}20;
                color: ${color};
                border: 1px solid ${color}40;
              ">${loc.status}</span>
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">📍 State: <strong>${loc.state}, ${loc.country}</strong></div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">👤 Manager: <strong>${loc.manager}</strong></div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">💰 MTD Revenue: <strong>${formatCurrencyValue(loc.revenue, activeCurrency)}</strong></div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          setSelectedOutlet(loc);
        });
      });

      // Fit bounds to active locations
      if (activeLocations.length > 0) {
        const bounds = L.latLngBounds(activeLocations.map((loc) => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }

      // Invalidate map size to prevent gray tiles or incomplete map rendering
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);

      setMapLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tileStyle, selectedCountry, selectedState]);

  const handleSelectOutlet = (loc: LocationNode) => {
    setSelectedOutlet(loc);
    if (mapInstanceRef.current && (window as any).L) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 9, {
        duration: 1.5,
      });
    }
  };

  const bgCard = theme?.card || "#0F172A";
  const borderCol = theme?.border || "#1E293B";
  const textColor = theme?.text || "#F8FAFC";
  const textMuted = theme?.textMuted || "#94A3B8";

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe size={18} color={accentColor} />
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              GIS OpenStreetMap Hub ({activeLocations.length} Active Nodes)
            </h3>
          </div>
          <p className="text-xs" style={{ color: textMuted }}>
            Coverage across 28 Indian States & 169 International Countries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTileStyle("dark")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              background: tileStyle === "dark" ? `${accentColor}25` : bgCard,
              borderColor: tileStyle === "dark" ? accentColor : borderCol,
              color: tileStyle === "dark" ? accentColor : textMuted,
            }}
          >
            <Layers size={13} /> Dark Vector Map
          </button>

          <button
            onClick={() => setTileStyle("street")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              background: tileStyle === "street" ? `${accentColor}25` : bgCard,
              borderColor: tileStyle === "street" ? accentColor : borderCol,
              color: tileStyle === "street" ? accentColor : textMuted,
            }}
          >
            <Compass size={13} /> OpenStreetMap Standard
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div
        className="relative w-full h-[420px] rounded-xl border overflow-hidden shadow-2xl transition-all"
        style={{ borderColor: borderCol, background: "#060709" }}
      >
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Rendering Global GIS Layers...
            </div>
          </div>
        )}

        {/* Selected Outlet Overlay Card */}
        {selectedOutlet && (
          <div
            className="absolute bottom-4 right-4 z-[400] max-w-sm rounded-xl p-4 border backdrop-blur-md shadow-2xl transition-all"
            style={{
              background: `${bgCard}EE`,
              borderColor: borderCol,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedOutlet.state}, {selectedOutlet.country}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{
                  background:
                    selectedOutlet.status === "Healthy"
                      ? "#10B98120"
                      : selectedOutlet.status === "Watch"
                      ? "#F59E0B20"
                      : "#FB718520",
                  color:
                    selectedOutlet.status === "Healthy"
                      ? "#10B981"
                      : selectedOutlet.status === "Watch"
                      ? "#F59E0B"
                      : "#FB7185",
                  borderColor:
                    selectedOutlet.status === "Healthy"
                      ? "#10B98140"
                      : selectedOutlet.status === "Watch"
                      ? "#F59E0B40"
                      : "#FB718540",
                }}
              >
                {selectedOutlet.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} color={accentColor} />
              <h4 className="text-sm font-bold" style={{ color: textColor }}>
                {selectedOutlet.name}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs my-2">
              <div className="rounded-lg p-2 border bg-slate-900/40" style={{ borderColor: borderCol }}>
                <div className="text-[10px] text-slate-400">MTD Revenue</div>
                <div className="font-semibold" style={{ color: accentColor }}>
                  {formatCurrencyValue(selectedOutlet.revenue, activeCurrency)}
                </div>
              </div>

              <div className="rounded-lg p-2 border bg-slate-900/40" style={{ borderColor: borderCol }}>
                <div className="text-[10px] text-slate-400">Active Stores</div>
                <div className="font-semibold" style={{ color: textColor }}>
                  {selectedOutlet.storesCount} Outlets
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t pt-2" style={{ borderColor: borderCol }}>
              <span>Manager: <strong className="text-slate-200">{selectedOutlet.manager}</strong></span>
              <span>NPS: <strong className="text-emerald-400">{selectedOutlet.nps}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Cards of Filtered Locations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {activeLocations.map((loc) => {
          const isSel = selectedOutlet?.id === loc.id;
          const distKm = haversineDistanceKm(puneHQ.lat, puneHQ.lng, loc.lat, loc.lng);

          return (
            <button
              key={loc.id}
              onClick={() => handleSelectOutlet(loc)}
              className="text-left p-3 rounded-xl border transition-all hover:scale-[1.02]"
              style={{
                background: isSel ? `${accentColor}1A` : bgCard,
                borderColor: isSel ? accentColor : borderCol,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold truncate" style={{ color: textColor }}>
                  {loc.name.split(" ")[0]}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      loc.status === "Healthy"
                        ? "#10B981"
                        : loc.status === "Watch"
                        ? "#F59E0B"
                        : "#FB7185",
                  }}
                />
              </div>

              <div className="text-[11px] font-bold" style={{ color: accentColor }}>
                {formatCurrencyValue(loc.revenue, activeCurrency)}
              </div>

              <div className="text-[10px] flex items-center gap-1 mt-1 text-slate-400 truncate">
                <Navigation size={10} />
                {loc.state}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
