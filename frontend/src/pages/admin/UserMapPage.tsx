import { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useRealTimeUsers } from "../../hooks/useRealTimeUsers";

// 📐 Hook per dimensioni responsive
function useGlobeDimensions() {
  const [size, setSize] = useState(500);

  useEffect(() => {
    const updateSize = () => {
      const containerWidth = window.innerWidth;

      if (containerWidth > 1280) {
        // Desktop XL: grande
        setSize(Math.min(containerWidth * 0.4, 800));
      } else if (containerWidth > 1024) {
        // Desktop: medio
        setSize(Math.min(containerWidth * 0.45, 700));
      } else if (containerWidth > 768) {
        // Tablet: 70% larghezza
        setSize(Math.min(containerWidth * 0.7, 600));
      } else {
        // Mobile: piccolo, max 400px
        setSize(Math.min(containerWidth - 32, 400));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

// 🎨 CONFIGURAZIONE GLOBE
const GLOBE_CONFIG = {
  globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg",
  bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
  backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
  atmosphereColor: "#3a8fb7",
  atmosphereAltitude: 0.15,
  autoRotateSpeed: 0.5,
};

// 📍 Coordinate città
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Italy
  "Rome, Italy": [41.9028, 12.4964],
  "Milan, Italy": [45.4642, 9.19],
  "Naples, Italy": [40.8518, 14.2681],
  "Catania, Italy": [37.5079, 15.083],
  "Florence, Italy": [43.7696, 11.2558],

  // UK
  "London, United Kingdom": [51.5074, -0.1278],
  "Manchester, United Kingdom": [53.4808, -2.2426],
  "Edinburgh, United Kingdom": [55.9533, -3.1883],
  "Belfast, United Kingdom": [54.5973, -5.9301],
  "London, UK": [51.5074, -0.1278], // Alias
  "Manchester, UK": [53.4808, -2.2426],
  "Edinburgh, UK": [55.9533, -3.1883],

  // Australia
  "Sydney, Australia": [-33.8688, 151.2093],
  "Melbourne, Australia": [-37.8136, 144.9631],
  "Brisbane, Australia": [-27.4698, 153.0251],
  "Perth, Australia": [-31.9505, 115.8605],
  "Adelaide, Australia": [-34.9285, 138.6007],
  "Canberra, Australia": [-35.2809, 149.13],

  // Canada
  "Toronto, Canada": [43.6532, -79.3832],
  "Vancouver, Canada": [49.2827, -123.1207],
  "Montreal, Canada": [45.5017, -73.5673],

  // USA
  "New York, United States": [40.7128, -74.006],
  "Los Angeles, United States": [34.0522, -118.2437],
  "Chicago, United States": [41.8781, -87.6298],
  "Denver, United States": [39.7392, -104.9903],
  "New York, USA": [40.7128, -74.006], // Alias
  "Los Angeles, USA": [34.0522, -118.2437],
  "Chicago, USA": [41.8781, -87.6298],

  // France
  "Paris, France": [48.8566, 2.3522],

  // Germany
  "Berlin, Germany": [52.52, 13.405],

  // Spain
  "Madrid, Spain": [40.4168, -3.7038],
  "Barcelona, Spain": [41.3851, 2.1734],

  // Netherlands
  "Amsterdam, Netherlands": [52.3676, 4.9041],

  // Europe fallback
  "Unknown, Europe": [50.0, 10.0],

  // Default fallback
  "Unknown, Unknown": [45.0, 10.0],
};

const getCityCoordinates = (
  city: string,
  country: string
): [number, number] => {
  // Try exact match first
  const exactKey = `${city}, ${country}`;
  if (CITY_COORDINATES[exactKey]) {
    console.log(`✅ Found exact coordinates for ${exactKey}`);
    return CITY_COORDINATES[exactKey];
  }

  // Try country-based search
  const countryMatch = Object.entries(CITY_COORDINATES).find(([k]) =>
    k.toLowerCase().includes(country.toLowerCase())
  );

  if (countryMatch) {
    console.log(`✅ Found country match for ${country}: ${countryMatch[0]}`);
    return countryMatch[1];
  }

  console.log(
    `⚠️ No coordinates found for ${city}, ${country} - using default`
  );
  return CITY_COORDINATES["Unknown, Unknown"];
};

// 🗺️ COMPONENTE PRINCIPALE
export default function UserGlobePage() {
  const { onlineUsers, loading, isWebSocketConnected, refreshData } =
    useRealTimeUsers();
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const globeSize = useGlobeDimensions();

  // 📊 Dati processati
  const pointsData = useMemo(() => {
    console.log("🌍 Processing users for globe:", onlineUsers.length);

    return onlineUsers
      .filter((user) => user.location?.country)
      .map((user) => {
        const { city, country } = user.location!;
        const [lat, lng] = getCityCoordinates(city || "Unknown", country);

        return {
          lat,
          lng,
          color: "#00ff88",
          label: `${user.firstName || "Anonymous"} - ${city}, ${country}`,
          user,
        };
      });
  }, [onlineUsers]);

  // 🎬 Setup globe
  useEffect(() => {
    if (globeRef.current && globeReady) {
      const controls = globeRef.current.controls();

      controls.autoRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = true;

      globeRef.current.pointOfView(
        { lat: 45.0, lng: 10.0, altitude: 2.2 },
        1000
      );

      console.log("✅ Globe: Responsive, No Zoom, Auto-rotate");
    }
  }, [globeReady]);

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
      {/* 📊 Header - RESPONSIVE + DARK MODE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            🌍 Real-Time User Globe
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Watch users shop around the world in 3D
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* WebSocket Status */}
          <Badge variant={isWebSocketConnected() ? "success" : "default"}>
            <span className="text-xs sm:text-sm">
              {isWebSocketConnected() ? "🟢 Live" : "🔴 Offline"}
            </span>
          </Badge>

          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "⏳" : "🔄"} Refresh
          </button>
        </div>
      </div>

      {/* 🌍 Globe + Sidebar Layout - RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* GLOBE CONTAINER - RESPONSIVE */}
        <div className="lg:col-span-2 flex items-start justify-center">
          <Card className="overflow-hidden bg-black w-full flex justify-center">
            <div
              className="relative"
              style={{ width: globeSize, height: globeSize }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                  <div className="text-white text-sm sm:text-xl">
                    🌍 Loading Globe...
                  </div>
                </div>
              )}

              <Globe
                ref={globeRef}
                globeImageUrl={GLOBE_CONFIG.globeImageUrl}
                bumpImageUrl={GLOBE_CONFIG.bumpImageUrl}
                backgroundImageUrl={GLOBE_CONFIG.backgroundImageUrl}
                showAtmosphere={true}
                atmosphereColor={GLOBE_CONFIG.atmosphereColor}
                atmosphereAltitude={GLOBE_CONFIG.atmosphereAltitude}
                pointsData={pointsData}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.015}
                pointRadius={0.5}
                pointLabel="label"
                onGlobeReady={() => {
                  console.log("🎉 Globe ready!");
                  setGlobeReady(true);
                }}
                width={globeSize}
                height={globeSize}
                backgroundColor="rgba(0,0,0,0)"
              />

              {/* 🔴 Live Indicator - TOP LEFT (FIXED) */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="relative flex items-center justify-center w-2.5 sm:w-3 h-2.5 sm:h-3">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    </div>
                    <span className="font-bold text-[10px] sm:text-xs tracking-wide text-gray-800">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* 🟢 Online Counter - TOP RIGHT */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                <div className="bg-green-50/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-400 sm:border-2 sm:border-green-500 shadow-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="relative flex items-center justify-center w-2 sm:w-2.5 h-2 sm:h-2.5">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-green-500 opacity-75 animate-pulse"></span>
                      <span className="relative inline-flex w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-600"></span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-green-700">
                      {onlineUsers.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* SIDEBAR Stats - RESPONSIVE GRID + DARK MODE */}
        <div className="lg:col-span-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
          {/* Card 1: Total Users */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                👥 <span className="hidden sm:inline">Total Users</span>
                <span className="sm:hidden">Users</span>
              </h3>
              <div className="animate-pulse w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {onlineUsers.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Currently online
            </p>
          </Card>

          {/* Card 2: Countries */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                🌍 <span className="hidden sm:inline">Countries</span>
                <span className="sm:hidden">Lands</span>
              </h3>
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
              {
                new Set(
                  onlineUsers.map((u) => u.location?.country).filter(Boolean)
                ).size
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Across the world
            </p>
          </Card>

          {/* Card 3: Cities */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                🏙️ Cities
              </h3>
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {
                new Set(
                  onlineUsers
                    .map((u) => `${u.location?.city}, ${u.location?.country}`)
                    .filter(Boolean)
                ).size
              }
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Active locations
            </p>
          </Card>

          {/* Card 4: WebSocket Status */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                📡 <span className="hidden sm:inline">Connection</span>
                <span className="sm:hidden">Status</span>
              </h3>
            </div>
            <div
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg ${
                isWebSocketConnected()
                  ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-600"
                  : "bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600"
              }`}
            >
              <span className="text-xl sm:text-2xl">
                {isWebSocketConnected() ? "🟢" : "🔴"}
              </span>
              <div>
                <p
                  className={`text-xs sm:text-sm font-bold ${
                    isWebSocketConnected()
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {isWebSocketConnected() ? "Live Stream" : "Disconnected"}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  {isWebSocketConnected()
                    ? "Real-time active"
                    : "Reconnecting..."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
