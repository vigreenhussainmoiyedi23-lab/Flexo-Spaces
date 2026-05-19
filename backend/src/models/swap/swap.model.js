const mongoose = require("mongoose");
const { COURIERS } = require("../../constants/CourierEnum");


const swapSchema = new mongoose.Schema({
  // requester offers a listing
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  requesterListing: { type: mongoose.Schema.Types.ObjectId, ref: "listing" },

  // owner has a listing for which requester requests
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  ownerListing: { type: mongoose.Schema.Types.ObjectId, ref: "listing" },

  message: String,
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "prepared_to_ship",
      "shipping",
      "disputed",
      "completed",
      "rejected",
      "cancelled",
      "cancelled_by_admin",
      "refund_listing"
    ]
  },
  shipments: [{
    from: {
      type: mongoose.Schema.Types.ObjectId, ref: "users"
    },
    courier: { type: String },
    trackingId: String,
    trackingUrl: String
  }],
  ownerAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: Number,
    phoneNumber: String
  },
  requesterAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: Number,
  },
  shipment_type: {
    type: String,
    enum: ["local_swap", "shipping"],
    default: "shipping"
  },
  completedBy: {
    requester: { type: Boolean, default: false },
    owner: { type: Boolean, default: false }
  },
  shippedBy: {
    requester: { type: Boolean, default: false },
    owner: { type: Boolean, default: false }
  },
  AddresGivenBy: {
    requester: { type: Boolean, default: false },
    owner: { type: Boolean, default: false }
  },
  disputedBy: {
    requester: { type: Boolean, default: false },
    owner: { type: Boolean, default: false }
  },
  ratedBy: {
    requester: { type: Boolean, default: false },
    owner: { type: Boolean, default: false }
  },
  changeHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChangeHistory"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Swap", swapSchema);