const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        // ======================================================
        // RELATIONS
        // ======================================================

        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "spaces",
            required: true,
            index: true,
        },

        // optional bookable unit inside workspace
        // example:
        // Hot Desk
        // Meeting Room
        // Cabin A
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

        // remaining seats after this booking
        remainingCapacitySnapshot: {
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
            basePrice: {
                type: Number,
                required: true,
            },
            platformFee: {
                type: Number,
                default: 0,
            },
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
        // NEGOTIATION
        // ======================================================

        negotiation: {
            isNegotiable: {
                type: Boolean,
                default: false,
            },
            requestedPrice: {
                type: Number,
            },
            counterOffer: {
                type: Number,
            },
            finalAgreedPrice: {
                type: Number,
            },
        },

        // ======================================================
        // STATUS FLOW
        // ======================================================

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "confirmed",
                "checked_in",
                "completed",
                "refunded",
                "cancelled",
                "rejected",
                "expired",
            ],
            default: "pending",
            index: true,
        },

        // ======================================================
        // PAYMENT
        // ======================================================

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
        },

        paymentDetails: {
            transactionId: {
                type: String,
            },

            paymentMethod: {
                type: String,
                enum: [
                    "razorpay",
                    "cash"
                ],
            },
            razorpayOrder: {
                id: String,
                currency: String,
                amount: Number
            },
            paidAt: {
                type: Date,
            },
        },

        // ======================================================
        // BOOKING LOCKING
        // ======================================================

        // used when payment is in progress
        // prevents double booking
        lockExpiresAt: {
            type: Date,
            default: null,
            index: true,
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
        // CHECK IN / CHECK OUT
        // ======================================================

        checkedInAt: {
            type: Date,
        },

        checkedOutAt: {
            type: Date,
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
        // CANCELLATION POLICY SNAPSHOT
        // ======================================================

        cancellationPolicy: {
            // free cancellation before X hours
            freeCancellationBeforeHours: {
                type: Number,
                default: 48,
            },

            // partial refund before X hours
            partialRefundBeforeHours: {
                type: Number,
                default: 24,
            },

            // refund percentage
            partialRefundPercentage: {
                type: Number,
                default: 50,
            },

            // fixed cancellation fee
            cancellationFee: {
                type: Number,
                default: 0,
            },
        },

        // ======================================================
        // WORKSPACE SNAPSHOT
        // ======================================================

        // preserves historical data
        // even if workspace changes later
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

        // ======================================================
        // METADATA
        // ======================================================

        source: {
            type: String,
            enum: ["web", "mobile", "admin"],
            default: "web",
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