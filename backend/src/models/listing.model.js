const mongoose = require("mongoose");
const { CLOTHING_TYPES, SIZES, CONDITIONS, CATEGORIES } = require("../constants/listingEnums");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    clothingType: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const validTypes = CLOTHING_TYPES[this.category];
                return validTypes?.includes(value);
            },
            message: "Invalid clothing type for selected category"
        }
    },

    brandName: {
        type: String,
        required: true
    },

    size: {
        type: String,
        enum: SIZES,
        required: true
    },

    condition: {
        type: String,
        enum: CONDITIONS,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: CATEGORIES
    },

    estimatedValue: {
        type: Number,
        min: 1,
    },

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
listingSchema.index({ "location.geo": "2dsphere" });
listingSchema.index({ owner: 1, createdAt: -1 }); // Compound index for efficient user listing retrieval
listingSchema.index({ title: "text" });

const listingModel = mongoose.model("listing", listingSchema)

module.exports = listingModel;