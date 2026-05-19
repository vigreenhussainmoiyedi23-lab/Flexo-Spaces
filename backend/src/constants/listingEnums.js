const CLOTHING_TYPES = {
    Tops: ["T-Shirt", "Shirt", "Polo Shirt", "Hoodie"],
    Bottoms: ["Jeans", "Trousers", "Shorts"],
    Dresses: ["Mini Dress", "Maxi Dress"],
    Outerwear: ["Jacket", "Coat", "Blazer"],
    Ethnic: ["Saree", "Kurta", "Lehenga"],
};

const CATEGORIES = Object.keys(CLOTHING_TYPES);

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXL+"];
const CONDITIONS = ["new", "like_new", "good", "fair", "poor"];

module.exports = {
    CLOTHING_TYPES,
    CATEGORIES,
    SIZES,
    CONDITIONS
};