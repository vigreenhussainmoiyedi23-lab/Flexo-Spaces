const axios = require("axios");

const CSC_API_KEY = process.env.CSC_API_KEY;
const GEO_API_KEY = process.env.OPENCAGE_API_KEY;

const validateLocation = async ({ country, state, city, lat, lng }) => {
  try {
    console.log("Validating location", country, state, city, lat, lng);
    // 1️⃣ Validate Country
    const countriesRes = await axios.get(
      "https://api.countrystatecity.in/v1/countries",
      {
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }
    );

    const validCountry = countriesRes.data.find(
      (c) => c.iso2 === country
    );
    if (!validCountry) throw new Error("Invalid country");

    // 2️⃣ Validate State
    const statesRes = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country}/states`,
      {
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }
    );

    const validState = statesRes.data.find(
      (s) => s.iso2 === state
    );
    if (!validState) throw new Error("Invalid state");

    // 3️⃣ Validate City
    const citiesRes = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country}/states/${state}/cities`,
      {
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }
    );

    const validCity = citiesRes.data.find(
      (c) => c.name.toLowerCase() === city.toLowerCase()
    );
    if (!validCity) throw new Error("Invalid city");

    // 4️⃣ Get accurate lat/lng from OpenCage
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city},${validState.name},${validCountry.name}&key=${GEO_API_KEY}`
    );

    if (!geoRes.data.results.length) {
      throw new Error("Could not resolve coordinates");
    }

    const geo = geoRes.data.results[0];
    const actualLat = geo.geometry.lat;
    const actualLng = geo.geometry.lng;

    // 5️⃣ Optional validation (if user sent lat/lng)
    if (lat && lng) {
      const latDiff = Math.abs(actualLat - lat);
      const lngDiff = Math.abs(actualLng - lng);

      if (latDiff > 0.5 || lngDiff > 0.5) {
        throw new Error("Invalid coordinates mismatch");
      }
    }
    console.log("Validated location");

    // ✅ Final clean response
    return {
      country: validCountry.name,
      state: validState.name,
      city: validCity.name,
      lat: actualLat,
      lng: actualLng,
    };

  } catch (err) {
    throw new Error(err.message || "Location validation failed");
  }
};

module.exports = { validateLocation };