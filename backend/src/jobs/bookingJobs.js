const agenda = require("../config/agenda");
const bookingModel = require("../models/booking/booking.model");

agenda.define("expire booking", async (job) => {
    const { bookingId } = job.attrs.data;

    const booking = await bookingModel.findOneAndUpdate(
        {
            _id: bookingId,
            status: { $in: ["pending", "reserved"] },
        },
        {
            status: "expired",
            expiredAt: new Date(),
        },
        {
            new: true,
        }
    );
    console.log("Booking expired:", booking);
});
