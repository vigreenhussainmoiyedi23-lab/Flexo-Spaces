const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {

        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "spaces",
            required: true,
            index: true,
        },


        resource: {
            type: String,
            default: null,
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },

        // ======================================================
        // DATE & TIME
        // ======================================================

        fromDateTime: {
            type: Date,
            required: true,
            index: true,
        },

        endDateTime: {
            type: Date,
            required: true,
            index: true,
        },


        // ======================================================
        // CAPACITY
        // ======================================================

        // how many seats user booked
        seatsBooked: {
            type: Number,
            default: 1,
            min: 1,
        },

        // snapshot at booking time
        totalCapacitySnapshot: {
            type: Number,
            required: true,
        },

        // ======================================================
        // BOOKING TYPE
        // ======================================================

        bookingType: {
            type: String,
            enum: [
                "hourly",
                "daily",
                "weekly",
                "monthly",
                "custom",
            ],
            required: true,
        },

        // ======================================================
        // PRICING SNAPSHOT
        // ======================================================

        pricing: {
            finalPrice: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                default: "INR",
            },
        },



        // ======================================================
        // STATUS FLOW
        // ======================================================
        // confirmed--refunded--cancelled
        status: {
            type: String,
            enum: [ // just marking which status are done and which are pending
                "pending", //✅
                "accepted", //✅
                "completed",
                "cancelled", //✅
                "rejected", //✅
                "withdrawn", //✅
                "expired" //✅
            ],
            default: "pending",
            index: true,
        },

        isCompletedBy: {
            owner: {
                type: Boolean,
                default: false,
            },
            bookedBy: {
                type: Boolean,
                default: false,
            }
        },


        // ======================================================
        // AUTO EXPIRY
        // ======================================================

        // pending requests can expire automatically
        expiresAt: {
            type: Date,
            default: null,
            index: true,
        },

        // ======================================================
        // CANCELLATION
        // ======================================================

        cancellation: {
            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },

            reason: {
                type: String,
                trim: true,
                maxlength: 500,
            },

            cancelledAt: {
                type: Date,
            },
        },

        // ======================================================
        // WORKSPACE SNAPSHOT
        // ======================================================

        workspaceSnapshot: {
            title: String,

            address: String,

            city: String,

            state: String,

            country: String,

            selectedAmenities: [String],
        },

        // ======================================================
        // NOTES
        // ======================================================

        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
        },


        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);



// ======================================================
// VALIDATIONS
// ======================================================

bookingSchema.pre("save", async function (next) {
    // invalid range
    if (this.fromDateTime >= this.endDateTime) {
        throw new Error("Invalid booking range");
    }

    // seats validation
    if (this.seatsBooked > this.totalCapacitySnapshot) {
        throw new Error("Seats booked exceed workspace capacity")
    }

});



// ======================================================
// INDEXES
// ======================================================

// overlap queries
bookingSchema.index({
    space: 1,
    fromDateTime: 1,
    endDateTime: 1,
});

// resource overlap queries
bookingSchema.index({
    resource: 1,
    fromDateTime: 1,
    endDateTime: 1,
});

// user dashboard
bookingSchema.index({
    bookedBy: 1,
    status: 1,
});

// owner dashboard
bookingSchema.index({
    owner: 1,
    status: 1,
});



// recurring booking queries
bookingSchema.index({
    "recurrence.isRecurring": 1,
});

// status analytics
bookingSchema.index({
    status: 1,
    paymentStatus: 1,
});



const bookingModel = mongoose.model("booking", bookingSchema);

module.exports = bookingModel;