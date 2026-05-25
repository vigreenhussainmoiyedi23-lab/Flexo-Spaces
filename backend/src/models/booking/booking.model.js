import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        // ======================================================
        // RELATIONS
        // ======================================================

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },

        // optional bookable unit inside workspace
        // example:
        // Hot Desk
        // Meeting Room
        // Cabin A
        resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resource",
            default: null,
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // ======================================================
        // DATE & TIME
        // ======================================================

        startDateTime: {
            type: Date,
            required: true,
            index: true,
        },

        endDateTime: {
            type: Date,
            required: true,
            index: true,
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
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

            taxes: {
                type: Number,
                default: 0,
            },

            platformFee: {
                type: Number,
                default: 0,
            },

            discount: {
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
                "approved",
                "payment_pending",
                "confirmed",
                "checked_in",
                "completed",
                "cancelled",
                "rejected",
                "expired",
                "refunded",
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
                "partially_paid",
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
                    "stripe",
                    "upi",
                    "cash",
                    "bank_transfer",
                ],
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
                ref: "User",
            },

            reason: {
                type: String,
                trim: true,
                maxlength: 500,
            },

            cancelledAt: {
                type: Date,
            },

            refundAmount: {
                type: Number,
                default: 0,
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
        // RECURRING BOOKINGS
        // ======================================================

        recurrence: {
            isRecurring: {
                type: Boolean,
                default: false,
            },

            frequency: {
                type: String,
                enum: ["daily", "weekly", "monthly"],
            },

            interval: {
                type: Number,
            },

            recurringEndDate: {
                type: Date,
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

bookingSchema.pre("save", function (next) {
    // invalid range
    if (this.startDateTime >= this.endDateTime) {
        return next(new Error("Invalid booking range"));
    }

    // seats validation
    if (this.seatsBooked > this.totalCapacitySnapshot) {
        return next(
            new Error("Seats booked exceed workspace capacity")
        );
    }

    next();
});



// ======================================================
// INDEXES
// ======================================================

// overlap queries
bookingSchema.index({
    workspace: 1,
    startDateTime: 1,
    endDateTime: 1,
});

// resource overlap queries
bookingSchema.index({
    resource: 1,
    startDateTime: 1,
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

// pending booking cleanup
bookingSchema.index({
    expiresAt: 1,
});

// payment lock cleanup
bookingSchema.index({
    lockExpiresAt: 1,
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



const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;