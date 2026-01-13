import { useState, useMemo, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useRealTimeUsers } from "../../hooks/useRealTimeUsers";

import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface CityAggregatedData {
  city: string;
  country: string;
  region: string;
  userCount: number;
  approximateCenter: [number, number];
  users: any[];
}

interface CountryStats {
  country: string;
  totalUsers: number;
  cities: Set<string>;
  approximateCenter: [number, number];
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  // Italia
  "Rome, Italy": [41.9028, 12.4964],
  "Milan, Italy": [45.4642, 9.19],
  "Naples, Italy": [40.8518, 14.2681],
  "Turin, Italy": [45.0703, 7.6869],
  "Florence, Italy": [43.7696, 11.2558],
  "Venice, Italy": [45.4408, 12.3155],
  "Bologna, Italy": [44.4949, 11.3426],
  "Genoa, Italy": [44.4056, 8.9463],
  "Palermo, Italy": [38.1157, 13.3615],
  "Catania, Italy": [37.5079, 15.083],

  // Europa
  "Paris, France": [48.8566, 2.3522],
  "Lyon, France": [45.764, 4.8357],
  "Marseille, France": [43.2965, 5.3698],
  "Berlin, Germany": [52.52, 13.405],
  "Munich, Germany": [48.1351, 11.582],
  "Hamburg, Germany": [53.5511, 9.9937],
  "Madrid, Spain": [40.4168, -3.7038],
  "Barcelona, Spain": [41.3851, 2.1734],
  "Valencia, Spain": [39.4699, -0.3763],
  "London, UK": [51.5074, -0.1278],
  "Manchester, UK": [53.4808, -2.2426],
  "Birmingham, UK": [52.4862, -1.8904],
  "Amsterdam, Netherlands": [52.3676, 4.9041],
  "Rotterdam, Netherlands": [51.9244, 4.4777],
  "Brussels, Belgium": [50.8503, 4.3517],
  "Vienna, Austria": [48.2082, 16.3738],
  "Zurich, Switzerland": [47.3769, 8.5417],
  "Geneva, Switzerland": [46.2044, 6.1432],
  "Stockholm, Sweden": [59.3293, 18.0686],
  "Copenhagen, Denmark": [55.6761, 12.5683],
  "Oslo, Norway": [59.9139, 10.7522],

  // Nord America
  "New York, USA": [40.7128, -74.006],
  "Los Angeles, USA": [34.0522, -118.2437],
  "Chicago, USA": [41.8781, -87.6298],
  "Houston, USA": [29.7604, -95.3698],
  "Toronto, Canada": [43.6532, -79.3832],
  "Montreal, Canada": [45.5017, -73.5673],
  "Vancouver, Canada": [49.2827, -123.1207],

  // Asia
  "Tokyo, Japan": [35.6762, 139.6503],
  "Seoul, South Korea": [37.5665, 126.978],
  "Singapore, Singapore": [1.3521, 103.8198],
  "Hong Kong, China": [22.3193, 114.1694],
  "Shanghai, China": [31.2304, 121.4737],

  // Oceania
  "Sydney, Australia": [-33.8688, 151.2093],
  "Melbourne, Australia": [-37.8136, 144.9631],
  "Auckland, New Zealand": [-36.8485, 174.7633],

  // Sud America
  "São Paulo, Brazil": [-23.5505, -46.6333],
  "Buenos Aires, Argentina": [-34.6037, -58.3816],

  // Default fallback (Centro Europa)
  "Unknown, Unknown": [50.0, 10.0],
};

const getCityCoordinates = (
  city: string,
  country: string
): [number, number] => {
  const key = `${city}, ${country}`;

  if (CITY_COORDINATES[key]) {
    return CITY_COORDINATES[key];
  }

  const countryMatch = Object.entries(CITY_COORDINATES).find(([k]) =>
    k.includes(country)
  );

  if (countryMatch) {
    return countryMatch[1];
  }

  return CITY_COORDINATES["Unknown, Unknown"];
};

const mapStyles = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '© <a href="https://www.esri.com/">Esri</a>',
  },
};

export default function UserMapPage() {
  const { onlineUsers, loading, isWebSocketConnected, refreshData } =
    useRealTimeUsers();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>("dark");
  const mapRef = useRef<any>(null);

  const initialView = useRef({
    center: [45.0, 10.0] as [number, number],
    zoom: 4,
  });

  const { cityData, countryStats, totalOnline } = useMemo(() => {
    console.log(
      "🔍 Processing onlineUsers (IP-only aggregation):",
      onlineUsers.length
    );
    const cityMap = new Map<string, CityAggregatedData>();
    const countryMap = new Map<string, CountryStats>();

    (onlineUsers || []).forEach((user) => {
      if (!user?.location?.country) {
        console.warn("❌ User missing location country");
        return;
      }

      const { country, city, region } = user.location;
      const cityKey = `${city}, ${country}`;

      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          city: city || "Unknown",
          country,
          region: region || "Unknown",
          userCount: 0,
          approximateCenter: getCityCoordinates(city, country),
          users: [],
        });
      }

      const cityData = cityMap.get(cityKey)!;
      cityData.userCount++;
      cityData.users.push({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      if (!countryMap.has(country)) {
        countryMap.set(country, {
          country,
          totalUsers: 0,
          cities: new Set(),

          approximateCenter: getCityCoordinates("", country),
        });
      }

      const countryData = countryMap.get(country)!;
      countryData.totalUsers++;
      countryData.cities.add(city || "Unknown");
    });

    const result = {
      cityData: Array.from(cityMap.values()),
      countryStats: Array.from(countryMap.values()).sort(
        (a, b) => b.totalUsers - a.totalUsers
      ),
      totalOnline: Array.from(cityMap.values()).reduce(
        (sum, city) => sum + city.userCount,
        0
      ),
    };

    console.log("✅ Aggregated data (privacy-friendly):", {
      totalCities: result.cityData.length,
      totalCountries: result.countryStats.length,
      totalUsers: result.totalOnline,
    });

    return result;
  }, [onlineUsers]);

  const flyToLocation = useCallback(
    (lat: number, lng: number, zoom: number = 6, animate: boolean = true) => {
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], zoom, {
          animate,
          duration: animate ? 1.2 : 0,
        });
      }
    },
    []
  );

  const resetToInitialView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(
        initialView.current.center,
        initialView.current.zoom,
        {
          animate: true,
          duration: 1.0,
        }
      );
    }
  }, []);

  const handleCountryClick = useCallback(
    (country: CountryStats) => {
      setSelectedCountry(country.country);
      flyToLocation(
        country.approximateCenter[0],
        country.approximateCenter[1],
        5,
        true
      );
    },
    [flyToLocation]
  );

  const handleCityClick = useCallback(
    (city: CityAggregatedData, shouldZoom: boolean = false) => {
      setSelectedCity(`${city.city}, ${city.country}`);

      if (shouldZoom) {
        flyToLocation(
          city.approximateCenter[0],
          city.approximateCenter[1],
          7,
          true
        );
      }
    },
    [flyToLocation]
  );

  const MapEventHandler = () => {
    useMapEvents({
      popupclose: () => {
        console.log("Popup closed, resetting to initial view");
        setTimeout(() => {
          resetToInitialView();
        }, 300);
      },
    });
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-gray-300 rounded mb-4"></div>
        <div className="h-[600px] bg-gray-300 rounded-xl"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🌍 User Location Analytics
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isWebSocketConnected() ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isWebSocketConnected() ? "Live Connection" : "Connection Lost"} -
            Last update: {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => refreshData && refreshData()}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? "🔄" : "↻"} Refresh
          </button>

          {/* Map Style Switcher */}
          {(Object.keys(mapStyles) as Array<keyof typeof mapStyles>).map(
            (style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mapStyle === style
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Map */}
      <Card padding={false} className="overflow-hidden shadow-2xl">
        <div className="h-[720px] w-full relative">
          <MapContainer
            ref={mapRef}
            center={initialView.current.center}
            zoom={initialView.current.zoom}
            style={{ height: "100%", width: "100%" }}
            className="z-10"
            zoomControl={true}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
          >
            <TileLayer
              attribution={mapStyles[mapStyle].attribution}
              url={mapStyles[mapStyle].url}
              maxZoom={18}
              subdomains={["a", "b", "c"]}
            />

            <MapEventHandler />

            {/* City Markers */}
            {cityData.map((city, index) => {
              const isSelected =
                selectedCity === `${city.city}, ${city.country}`;
              const radius = Math.max(8, Math.min(30, 5 + city.userCount * 2));
              const color =
                city.userCount > 10
                  ? "#ef4444"
                  : city.userCount > 5
                  ? "#f97316"
                  : city.userCount > 2
                  ? "#eab308"
                  : "#22c55e";

              return (
                <CircleMarker
                  key={`city-${city.city}-${city.country}-${index}`}
                  center={city.approximateCenter}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    color: isSelected ? "#ffffff" : color,
                    weight: isSelected ? 3 : 2,
                    opacity: 1,
                    fillOpacity: 0.7,
                  }}
                  eventHandlers={{
                    click: () => handleCityClick(city, false),
                  }}
                >
                  <Popup
                    maxWidth={300}
                    minWidth={220}
                    autoPan={true}
                    autoPanPaddingTopLeft={[10, 100]}
                    autoPanPaddingBottomRight={[10, 10]}
                    closeButton={true}
                    autoClose={false}
                    keepInView={true}
                  >
                    <div className="p-3 min-w-[220px]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{city.city}</h3>
                          <p className="text-sm text-gray-600">
                            {city.country} - {city.region}
                          </p>
                        </div>
                        <Badge variant="success">LIVE</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">
                            Active Users:
                          </span>
                          <span className="font-bold text-green-600 text-lg">
                            {city.userCount}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            flyToLocation(
                              city.approximateCenter[0],
                              city.approximateCenter[1],
                              9,
                              true
                            );
                          }}
                          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          🔍 Zoom In
                        </button>

                        {city.userCount <= 5 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Active Users:
                            </p>
                            <div className="space-y-1 max-h-[120px] overflow-y-auto">
                              {city.users.map((user, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-600 flex items-center gap-2"
                                >
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  {user.firstName} {user.lastName?.charAt(0)}.
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Country Circles */}
            {countryStats
              .filter((stat) => stat.totalUsers > 5)
              .map((stat, index) => (
                <CircleMarker
                  key={`country-heat-${stat.country}-${index}`}
                  center={stat.approximateCenter}
                  radius={Math.min(40, stat.totalUsers * 2)}
                  pathOptions={{
                    fillColor: "#3b82f6",
                    color: "#1e40af",
                    weight: 2,
                    opacity: 0.4,
                    fillOpacity: 0.15,
                  }}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <h4 className="font-bold text-lg">{stat.country}</h4>
                      <p className="text-sm text-gray-600">
                        High Activity Zone
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stat.totalUsers}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.cities.size} cities
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>

          {/* Live indicator */}
          <div className="absolute top-3 left-15 z-[1000]">
            <div className="bg-white px-3 py-2 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex w-3 h-3 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-green-600"></span>
                </div>
                <span className="font-semibold text-xs tracking-wide text-gray-700">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Countries List & Activity */}
      {countryStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Locations */}
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🌍 Active Locations
              <Badge variant="success">{totalOnline} LIVE</Badge>
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {countryStats.map((stat, index) => (
                <div
                  key={stat.country}
                  className={`p-4 rounded-lg transition-all cursor-pointer border-2 ${
                    selectedCountry === stat.country
                      ? "bg-blue-50 border-blue-300 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => handleCountryClick(stat)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-gray-400">
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">{stat.country}</h3>
                          <p className="text-sm text-gray-600">
                            {Array.from(stat.cities).slice(0, 2).join(", ")}
                            {stat.cities.size > 2 &&
                              ` +${stat.cities.size - 2} more`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          stat.totalUsers > 10
                            ? "success"
                            : stat.totalUsers > 5
                            ? "warning"
                            : "default"
                        }
                      >
                        {stat.totalUsers}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.cities.size}{" "}
                        {stat.cities.size === 1 ? "city" : "cities"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Activity */}
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⚡ Live Activity
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {cityData
                .slice()
                .sort((a, b) => b.userCount - a.userCount)
                .slice(0, 10)
                .map((city, index) => (
                  <div
                    key={`activity-${city.city}-${city.country}-${index}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all"
                    // Zoom solo quando clicchi dalla lista
                    onClick={() => handleCityClick(city, true)}
                  >
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {city.city}, {city.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        {city.userCount}{" "}
                        {city.userCount === 1 ? "visitor" : "visitors"} active
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">LIVE</Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to zoom
                      </p>
                    </div>
                  </div>
                ))}

              {cityData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Waiting for visitors...
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Users will appear when they visit your site
                  </p>
                  <div className="inline-flex items-center space-x-2 text-sm bg-green-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Tracking system ready</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
