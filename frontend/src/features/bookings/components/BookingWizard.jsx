import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import useBooking from "../hooks/useBooking";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import showToast from "../../../utils/Toastify.util";
import { useSpace } from "../../spaces/hooks/useSpace";
import Loader from "../../commonComponents/Loading";

const steps = [
  "Select Time",
  "Availability",
  "Seat Selection",
  "Booking Details",
  "Review",
  "Confirmation",
];

const BookingWizard = () => {
  const validateStepOne = () => {
    const { fromDate, fromTime, toTime, toDate } = formData;

    if (!fromDate || !fromTime || !toTime || !toDate) {
      return false;
    }
    if (new Date(`${fromDate}T${fromTime}`) > new Date(`${toDate}T${toTime}`))
      return false;
    if (new Date(`${fromDate}T${fromTime}`) < new Date()) return false;
    return true;
  };
  const [space, setSpace] = useState({});
  const { id } = useParams();
  const { getSpaceById } = useSpace();
  const [activeStep, setActiveStep] = useState(0);
  useBooking();
  const now = new Date();
  const [formData, setFormData] = useState({
    fromDate: now.toISOString().split("T")[0], // YYYY-MM-DD
    fromTime: now.toTimeString().slice(0, 5), // HH:mm
    toDate: now.toISOString().split("T")[0], // YYYY-MM-DD
    toTime: now.toTimeString().slice(0, 5), // HH:mm

    maxAvailableSeats: 0,
    overlappingBookings: [],
    selectedSeats: 1,
    fullName: "",
    notes: "",
  });
  useEffect(() => {
    async function fetchspace() {
      const response = await getSpaceById(id);
      setSpace(response.Space);
    }
    fetchspace();
  }, [id]);
  if (!space) return <Loader />;
  const nextStep = () => {
    if (activeStep === 0 && !validateStepOne())
      return showToast("Please select a valid time range", "error");
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <TimeSelectionStep formData={formData} updateField={updateField} />
        );

      case 1:
        return (
          <AvailabilityStep formData={formData} setFormData={setFormData} />
        );

      case 2:
        return (
          <SeatSelectionStep formData={formData} updateField={updateField} />
        );

      case 3:
        return (
          <BookingDetailsStep
            space={space}
            formData={formData}
            updateField={updateField}
          />
        );

      case 4:
        return <ReviewStep space={space} formData={formData} />;

      case 5:
        return <ConfirmationStep spaceId={id} data={formData} />;

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: 5,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Workspace Booking
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box minHeight={350}>{renderStep()}</Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={prevStep}
            variant="outlined"
          >
            Back
          </Button>

          {activeStep !== steps.length - 1 && (
            <Button variant="contained" onClick={nextStep}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
function TimeSelectionStep({ formData, updateField }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Select Booking Time
      </Typography>

      <Grid container spacing={3}>
        {/* Start Date */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={formData.fromDate}
            onChange={(e) => updateField("fromDate", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputLabel-root": {
                backgroundColor: "white",
                px: 0.5,
              },
            }}
          />
        </Grid>

        {/* Start Time */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            value={formData.fromTime}
            onChange={(e) => updateField("fromTime", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputLabel-root": {
                backgroundColor: "white",
                px: 0.5,
              },
            }}
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={formData.toDate}
            onChange={(e) => updateField("toDate", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputLabel-root": {
                backgroundColor: "white",
                px: 0.5,
              },
            }}
          />
        </Grid>

        {/* End Time */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="time"
            label="End Time"
            value={formData.toTime}
            onChange={(e) => updateField("toTime", e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputLabel-root": {
                backgroundColor: "white",
                px: 0.5,
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function AvailabilityStep({ formData, setFormData }) {
  const {
    availableSeats,
    getAvailableSeatsAndOverLappingBookings,
    overlappingBookings,
  } = useBooking();
  const { id: spaceId } = useParams();
  useEffect(() => {
    if (formData.maxAvailableSeats && formData.overlappingBookings.length > 0)
      return;
    async function fetch() {
      await getAvailableSeatsAndOverLappingBookings(spaceId, {
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        toTime: formData.toTime,
        fromTime: formData.fromTime,
      });
      setFormData((prev) => ({
        ...prev,
        maxAvailableSeats: availableSeats,
        overlappingBookings,
      }));
      console.log("setting available seats", availableSeats);
    }
    if (formData.fromDate && formData.toDate) {
      fetch();
    }
  }, [spaceId]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Availability Analysis
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Maximum continuous seats available for selected duration:
        <strong> {availableSeats || "--"}</strong>
      </Alert>

      <Paper variant="outlined" sx={{ p: 3 }}>
        {overlappingBookings.map((booking) => (
          <Typography variant="body2" key={booking.id}>
            {booking.fromDateTime.toISOString()}-{booking.endDateTime}:{" "}
            <strong>{booking.seatsBooked}</strong> seats
          </Typography>
        ))}
        {overlappingBookings.length === 0 && "No overlapping bookings found."}
        <Typography variant="body2" mt={3} color="text.secondary">
          The system calculates the minimum available capacity across your
          selected duration.
        </Typography>
      </Paper>
    </Box>
  );
}

function SeatSelectionStep({ formData, updateField }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Select Seats
      </Typography>

      <TextField
        fullWidth
        select
        label="Seats Required"
        value={formData.selectedSeats}
        onChange={(e) => updateField("selectedSeats", e.target.value)}
      >
        {Array.from({
          length: formData.maxAvailableSeats,
        }).map((_, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            {index + 1} Seats
          </MenuItem>
        ))}
      </TextField>

      <Alert severity="success" sx={{ mt: 3 }}>
        Your selected duration can support up to {formData.maxAvailableSeats}{" "}
        seats.
      </Alert>
    </Box>
  );
}

function BookingDetailsStep({ formData, updateField }) {
  return (
    <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Booking Details
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => updateField("fullName", e.target.value)}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Note for Owner"
        value={formData.notes}
        onChange={(e) => updateField("notes", e.target.value)}
      />
    </Box>
  );
}

function ReviewStep({ formData, space }) {
  const calculateEstimatedPrice = () => {
    if (
      !space?.pricing?.rate ||
      !space?.capacity ||
      !formData?.selectedSeats ||
      !formData?.fromDate ||
      !formData?.fromTime ||
      !formData?.toDate ||
      !formData?.toTime
    ) {
      return 0;
    }

    const start = new Date(`${formData.fromDate}T${formData.fromTime}`);

    const end = new Date(`${formData.toDate}T${formData.toTime}`);

    const diffMs = end - start;

    if (diffMs <= 0) return 0;

    // total duration in hours
    const totalHours = diffMs / (1000 * 60 * 60);

    // workspace rate per seat
    const seatRate = space.pricing.rate / space.capacity;

    let multiplier = 1;

    switch (space.pricing.interval) {
      case "hourly":
        multiplier = Math.ceil(totalHours);
        break;

      case "daily":
        multiplier = Math.ceil(totalHours / 24);
        break;

      case "weekly":
        multiplier = Math.ceil(totalHours / (24 * 7));
        break;

      case "monthly":
        multiplier = Math.ceil(totalHours / (24 * 30));
        break;

      default:
        multiplier = 1;
    }

    return seatRate * formData.selectedSeats * multiplier;
  };
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Review Booking
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography>
          <strong>Seats:</strong> {formData.selectedSeats}
        </Typography>

        <Typography>
          <strong>Start:</strong> {formData.fromDate} {formData.fromTime}
        </Typography>

        <Typography>
          <strong>End:</strong> {formData.toDate} {formData.toTime}
        </Typography>

        <Typography>
          <strong>Estimated Price:</strong> ₹
          {calculateEstimatedPrice().toFixed(2)}
        </Typography>

        <Alert severity="warning">Free cancellation before 48 hours.</Alert>
      </Paper>
    </Box>
  );
}

function ConfirmationStep({ spaceId, data }) {
  const { createBookingHandler } = useBooking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function createBooking() {
    if (booking || loading) showToast("Booking already created", "info");
    try {
      setLoading(true);
      const response = await createBookingHandler({ spaceId, ...data });
      navigate("/bookings");
      console.log("navigate");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box textAlign="center">
      {booking ? (
        <>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Booking Submitted 🎉
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Your booking request has been sent to the workspace owner.
          </Typography>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <button
            onClick={createBooking}
            className="px-3 py-1 rounded  exo-2 text-xl font-bold    bg-brand-200 text-text-primary hover:bg-brand-500/90 active:bg-brand-200 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </Box>
  );
}

export default BookingWizard;
