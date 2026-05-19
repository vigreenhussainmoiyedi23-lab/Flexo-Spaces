import { useEffect, useState } from "react";
import axios from "axios";

const CSC_API_KEY = import.meta.env.VITE_CSC_API_KEY;
const GEO_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
export default function LocationSelector({ location, setLocation }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await axios.get(
        "https://api.countrystatecity.in/v1/countries",
        {
          headers: { "X-CSCAPI-KEY": CSC_API_KEY },
        },
      );
      setCountries(res.data);
    };
    fetchCountries();
  }, []);

  // 🌍 USE CURRENT LOCATION
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode
          const geoRes = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEO_API_KEY}`,
          );

          const components = geoRes.data.results[0].components;

          const countryName = components.country;
          const stateName = components.state;
          const cityName =
            components.city || components.town || components.village;

          // 🔥 Find ISO codes from CSC API
          const country = countries.find((c) => c.name === countryName);

          if (!country) throw new Error("Country not found");

          const statesRes = await axios.get(
            `https://api.countrystatecity.in/v1/countries/${country.iso2}/states`,
            { headers: { "X-CSCAPI-KEY": CSC_API_KEY } },
          );

          const state = statesRes.data.find((s) => s.name === stateName);

          if (!state) throw new Error("State not found");

          const citiesRes = await axios.get(
            `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities`,
            { headers: { "X-CSCAPI-KEY": CSC_API_KEY } },
          );

          const city = citiesRes.data.find((c) => c.name === cityName);

          if (!city) throw new Error("City not found");

          // ✅ Set everything
          setStates(statesRes.data);
          setCities(citiesRes.data);

          setLocation({
            country: country.iso2,
            state: state.iso2,
            city: city.name,
            lat: latitude,
            lng: longitude,
          });
        } catch (err) {
          console.error(err);
          alert("Could not detect location properly");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Permission denied or error fetching location");
        setLoadingLocation(false);
      },
    );
  };

  // Country Change
  const handleCountryChange = async (country) => {
    setLocation({ ...location, country, state: "", city: "" });

    const res = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country}/states`,
      {
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      },
    );

    setStates(res.data);
    setCities([]);
  };

  // State Change
  const handleStateChange = async (state) => {
    setLocation({ ...location, state, city: "" });

    const res = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${location.country}/states/${state}/cities`,
      {
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      },
    );

    setCities(res.data);
  };

  // City Change
  const handleCityChange = (cityObj) => {
    setLocation({
      ...location,
      city: cityObj.name,
      lat: cityObj.latitude,
      lng: cityObj.longitude,
    });
  };

  return (
    <div className="flex flex-col gap-3 my-3">
      {/* 🌍 Use Current Location */}
      <button
        onClick={handleUseCurrentLocation}
        className="bg-brand-500 text-accent-500 source-code-pro font-bold text-base md:text-lg lg:text-xl  p-2 rounded"
        disabled={loadingLocation}
      >
        {loadingLocation ? "Detecting..." : "Use My Current Location"}
      </button>

      {/* Country */}
      <select
        value={location.country || ""}
        onChange={(e) => handleCountryChange(e.target.value)}
        className="border p-2 rounded border-brand-300"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.name}
          </option>
        ))}
      </select>

      {/* State */}
      <select
        value={location.state || ""}
        onChange={(e) => handleStateChange(e.target.value)}
        className="border p-2 rounded border-brand-300"
        disabled={!location.country}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.iso2} value={s.iso2}>
            {s.name}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        value={location.city || ""}
        onChange={(e) => {
          const selected = cities.find((c) => c.name === e.target.value);
          handleCityChange(selected);
        }}
        className="border p-2 rounded border-brand-300"
        disabled={!location.state}
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
