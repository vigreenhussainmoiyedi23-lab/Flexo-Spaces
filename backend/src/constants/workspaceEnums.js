// constants/workspaceEnums.js

// 🏙️ Core workspace inventory types
const SPACE_TYPES = [
    "Hot Desk",          // Flexible shared seating
    "Dedicated Desk",    // Assigned personal desk in a shared room
    "Private Office",    // Private, lockable room for individuals or teams
    "Meeting Room",      // Hourly conference/board rooms
    "Virtual Office",    // Business address and mail handling only
    "Event Space"        // Large open halls for workshops or networking
];

// ⏱️ Allowed billing intervals for commercial bookings
const PRICING_INTERVALS = [
    "hourly",
    "daily",
    "weekly",
    "monthly"
];

// 🛠️ Master list of valid amenity keys grouped by category 
// Useful for dynamic backend validation and frontend loops
const AMENITY_SCHEMA_MAP = {
    tech: [
        "enterpriseWifi",
        "videoConferencing",
        "podcastStudio",
        "smartBoard",
        "printerAccess"
    ],
    wellness: [
        "gym",
        "ergonomicFurniture",
        "outdoorSpace",
        "meditationRoom",
        "nursingRoom"
    ],
    hospitality: [
        "baristaCoffee",
        "stockedKitchen",
        "cateringService",
        "kombuchaOnTap"
    ],
    convenience: [
        "access247",
        "petFriendly",
        "evCharging",
        "showers",
        "secureParking"
    ]
};

// 🏷️ Human-readable labels for your Frontend UI UI rendering
const AMENITY_LABELS = {
    enterpriseWifi: "Enterprise Wi-Fi",
    videoConferencing: "4K Video Conferencing",
    podcastStudio: "Soundproof Podcast Studio",
    smartBoard: "Smart Board / Projector",
    printerAccess: "Printing & Scanning Station",
    
    gym: "On-site Gym & Fitness Center",
    ergonomicFurniture: "Ergonomic Standing Desks",
    outdoorSpace: "Rooftop / Terrace Garden",
    meditationRoom: "Quiet Meditation Room",
    nursingRoom: "Mother's Nursing Room",
    
    baristaCoffee: "Barista-Crafted Coffee",
    stockedKitchen: "Fully Stocked Pantry",
    cateringService: "On-site Catering",
    kombuchaOnTap: "Kombucha & Cold Brew on Tap",
    
    access247: "24/7 Keycard Access",
    petFriendly: "Pet Friendly Workspace",
    evCharging: "EV Charging Stations",
    showers: "End-of-Trip Showers & Lockers",
    secureParking: "Secure Covered Parking"
};

module.exports = {
    SPACE_TYPES,
    PRICING_INTERVALS,
    AMENITY_SCHEMA_MAP,
    AMENITY_LABELS
};
