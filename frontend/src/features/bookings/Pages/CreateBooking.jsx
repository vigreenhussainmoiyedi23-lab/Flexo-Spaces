import React from "react";
import BookingWizard from "../components/BookingWizard";

const CreateBooking = () => {
  const validateStepOne = () => {
    const { startDate, startTime, endDate, endTime } = formData;

    if (!startDate || !startTime || !endDate || !endTime) {
      return false;
    }

    return true;
  };
  return (
    <div>
      <BookingWizard />
    </div>
  );
};

export default CreateBooking;
