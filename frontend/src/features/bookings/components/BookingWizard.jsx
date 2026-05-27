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

const steps = [
  "Select Time",
  "Availability",
  "Seat Selection",
  "Booking Details",
  "Review",
  "Confirmation",
];

const BookingWizard = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",

    maxAvailableSeats: 10,
    selectedSeats: 1,

    fullName: "",
    notes: "",


    estimatedPrice: 5400,
  });

  const nextStep = () => {
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
        return <AvailabilityStep formData={formData} />;

      case 2:
        return (
          <SeatSelectionStep formData={formData} updateField={updateField} />
        );

      case 3:
        return (
          <BookingDetailsStep formData={formData} updateField={updateField} />
        );

      case 4:
        return <ReviewStep formData={formData} />;

      case 5:
        return <ConfirmationStep />;

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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            InputLabelProps={{ shrink: true }}
            value={formData.startTime}
            onChange={(e) => updateField("startTime", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="time"
            label="End Time"
            InputLabelProps={{ shrink: true }}
            value={formData.endTime}
            onChange={(e) => updateField("endTime", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function AvailabilityStep({ formData }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Availability Analysis
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Maximum continuous seats available for selected duration:
        <strong> {formData.maxAvailableSeats}</strong>
      </Alert>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="body1">
          • 10 AM - 2 PM → 20 seats remaining
        </Typography>

        <Typography variant="body1">
          • 2 PM - 3 PM → 50 seats remaining
        </Typography>

        <Typography variant="body1">
          • 3 PM - 8 PM → 10 seats remaining
        </Typography>

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

function ReviewStep({ formData }) {
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
          <strong>Start:</strong> {formData.startDate} {formData.startTime}
        </Typography>

        <Typography>
          <strong>End:</strong> {formData.endDate} {formData.endTime}
        </Typography>

        <Typography>
          <strong>Estimated Price:</strong> ₹{formData.estimatedPrice}
        </Typography>

        <Alert severity="warning">Free cancellation before 48 hours.</Alert>
      </Paper>
    </Box>
  );
}

function ConfirmationStep() {
  return (
    <Box textAlign="center">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Booking Submitted 🎉
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Your booking request has been sent to the workspace owner.
      </Typography>
    </Box>
  );
}

export default BookingWizard;
