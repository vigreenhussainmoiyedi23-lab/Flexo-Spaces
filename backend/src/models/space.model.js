const mongoose = require("mongoose");
// Replace clothing enums with workspace-specific configurations if needed
const { SPACE_TYPES, PRICING_INTERVALS, AMENITY_LABELS } = require("../constants/workspaceEnums.js");

const spaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    spaceType: {
        type: String,
        required: true,
        enum: SPACE_TYPES
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricing: {
        rate: { type: Number, required: true }, // The cost amount
        interval: {
            type: String,
            required: true,
            enum: PRICING_INTERVALS
        }
    },
    // ADDED: Structured nesting for advanced amenity filtering
    amenities: { type: String},
    images: [{
        type: {
            url: {
                type: String,
                required: [true, "Image url is required"]
            },
            fileId: {
                type: String,
                required: [true, "Image fileId is required"]
            },
            thumbnail: {
                type: String,
                required: [true, "Image thumbnail is required"]
            }
        },
        required: [true, "At least one image is required"]
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    location: {
        geo: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]
            },
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
}, { timestamps: true });

// INDEXES FOR MAXIMUM FILTERING EFFICIENCY
spaceSchema.index({ "location.geo": "2dsphere" });
spaceSchema.index({ owner: 1, createdAt: -1 });
spaceSchema.index({ title: "text" });

// Added compound indexes for high-frequency filtering combinations
spaceSchema.index({ "pricing.rate": 1, isAvailable: 1 });
spaceSchema.index({ "amenities.tech.enterpriseWifi": 1 });
spaceSchema.index({ "amenities.convenience.access247": 1 });

const space = mongoose.model("spaces", spaceSchema);

module.exports = space;
