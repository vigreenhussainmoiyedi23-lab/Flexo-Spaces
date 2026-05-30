import React, { useEffect, useState } from "react";
import BookingWizard from "../components/BookingWizard";
import useBooking from "../hooks/useBooking";
import BookingGrid from "../components/BookingGrid";

const Swaps = () => {
  let typeConditions = {
    incoming: {
      type: "received",
      status: "pending",
    },
    sent: {
      type: "sent",
      status: "pending",
    },
    active: {
      type: "all",
      status: "accepted",
    },
    declined: {
      type: "all",
      status: ["rejected", "cancelled"],
    },
    completed: {
      type: "all",
      status: "completed",
    },
    all: {
      type: "all",
      status: "all",
    },
  };
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { userAllSwaps, loading, getSwapRequests, totalPages } = useBooking();
  const [shipment_type, setShipment_type] = useState("all");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const second = async () => {
      const filters = {
        status: typeConditions[activeFilter].status,
        type: typeConditions[activeFilter].type,
        shipment_type,
        limit: 10,
        page: page,
      };
      await getSwapRequests({ filters });
    };
    second();
  }, [activeFilter, shipment_type, page]);

  return (
    <div className="w-full min-h-screen bg-brand-900 relative pt-[12vh]">
      <BookingGrid
        bookings={[
          {
            _id: "6a1993b7134f57a9bedaf33b",
            space: {
              _id: "6a1465695bc739473150ffa6",
              title: "A premium office",
              description: "this is a very premium office",
              spaceType: "Hot Desk",
              capacity: 3,
              pricing: {
                rate: 1500,
                interval: "daily",
              },
              amenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
              images: [
                {
                  url: "https://ik.imagekit.io/h110m786/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  fileId: "6a1465695c7cd75eb81c63ff",
                  thumbnail:
                    "https://ik.imagekit.io/h110m786/tr:n-ik_ml_thumbnail/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  _id: "6a1465695bc739473150ffa7",
                },
              ],
              owner: "6a1005a202cf5937e13194e9",
              isAvailable: true,
              isRemoved: false,
              isLocked: false,
              location: {
                geo: {
                  coordinates: [75.8681996, 22.7203616],
                  type: "Point",
                },
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
              },
              createdAt: "2026-05-25T15:06:17.599Z",
              updatedAt: "2026-05-25T15:06:17.599Z",
              __v: 0,
            },
            resource: "Hot Desk",
            bookedBy: {
              _id: "6a0f1c1fad00834d4c687e73",
              username: "Hussain moiyedi",
              email: "vigreenhussainmoiyedi23@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJqEOO0qP1bSsJFNWHAO7Fkba-UoDsXe5Z5XFvIVkWQFBJ85dBq=s96-c",
              rating: 0,
            },
            owner: {
              _id: "6a1005a202cf5937e13194e9",
              username: "Shabbir Moiyedi",
              email: "shabbirmoiyedi110@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJUygRZxgm9gRGB4mXOGVLCOst2hRsy0mh6y5c59xSaISbDGy2I=s96-c",
              rating: 0,
            },
            fromDateTime: "2026-06-26T10:00:00.000Z",
            endDateTime: "2026-06-27T15:00:00.000Z",
            seatsBooked: 3,
            totalCapacitySnapshot: 3,
            remainingCapacitySnapshot: 0,
            bookingType: "daily",
            pricing: {
              basePrice: 3000,
              platformFee: 300,
              finalPrice: 3300,
              currency: "INR",
            },
            negotiation: {
              isNegotiable: false,
            },
            status: "pending",
            paymentStatus: "pending",
            lockExpiresAt: null,
            expiresAt: null,
            cancellationPolicy: {
              freeCancellationBeforeHours: 48,
              partialRefundBeforeHours: 24,
              partialRefundPercentage: 50,
              cancellationFee: 0,
            },
            workspaceSnapshot: {
              title: "A premium office",
              city: "Indore",
              state: "Madhya Pradesh",
              country: "India",
              selectedAmenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
            },
            notes: "Jo cjaje npj alsm",
            source: "web",
            isActive: true,
            createdAt: "2026-05-29T13:25:11.554Z",
            updatedAt: "2026-05-29T13:25:11.554Z",
            __v: 0,
          },
          {
            _id: "6a19943c134f57a9bedaf33e",
            space: {
              _id: "6a1465695bc739473150ffa6",
              title: "A premium office",
              description: "this is a very premium office",
              spaceType: "Hot Desk",
              capacity: 3,
              pricing: {
                rate: 1500,
                interval: "daily",
              },
              amenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
              images: [
                {
                  url: "https://ik.imagekit.io/h110m786/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  fileId: "6a1465695c7cd75eb81c63ff",
                  thumbnail:
                    "https://ik.imagekit.io/h110m786/tr:n-ik_ml_thumbnail/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  _id: "6a1465695bc739473150ffa7",
                },
              ],
              owner: "6a1005a202cf5937e13194e9",
              isAvailable: true,
              isRemoved: false,
              isLocked: false,
              location: {
                geo: {
                  coordinates: [75.8681996, 22.7203616],
                  type: "Point",
                },
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
              },
              createdAt: "2026-05-25T15:06:17.599Z",
              updatedAt: "2026-05-25T15:06:17.599Z",
              __v: 0,
            },
            resource: "Hot Desk",
            bookedBy: {
              _id: "6a0f1c1fad00834d4c687e73",
              username: "Hussain moiyedi",
              email: "vigreenhussainmoiyedi23@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJqEOO0qP1bSsJFNWHAO7Fkba-UoDsXe5Z5XFvIVkWQFBJ85dBq=s96-c",
              rating: 0,
            },
            owner: {
              _id: "6a1005a202cf5937e13194e9",
              username: "Shabbir Moiyedi",
              email: "shabbirmoiyedi110@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJUygRZxgm9gRGB4mXOGVLCOst2hRsy0mh6y5c59xSaISbDGy2I=s96-c",
              rating: 0,
            },
            fromDateTime: "2026-06-26T10:00:00.000Z",
            endDateTime: "2026-06-27T15:00:00.000Z",
            seatsBooked: 3,
            totalCapacitySnapshot: 3,
            remainingCapacitySnapshot: 0,
            bookingType: "daily",
            pricing: {
              basePrice: 3000,
              platformFee: 300,
              finalPrice: 3300,
              currency: "INR",
            },
            negotiation: {
              isNegotiable: false,
            },
            status: "pending",
            paymentStatus: "pending",
            lockExpiresAt: null,
            expiresAt: null,
            cancellationPolicy: {
              freeCancellationBeforeHours: 48,
              partialRefundBeforeHours: 24,
              partialRefundPercentage: 50,
              cancellationFee: 0,
            },
            workspaceSnapshot: {
              title: "A premium office",
              city: "Indore",
              state: "Madhya Pradesh",
              country: "India",
              selectedAmenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
            },
            notes: "Jo cjaje npj alsm",
            source: "web",
            isActive: true,
            createdAt: "2026-05-29T13:27:24.957Z",
            updatedAt: "2026-05-29T13:27:24.957Z",
            __v: 0,
          },
          {
            _id: "6a1994ad134f57a9bedaf341",
            space: {
              _id: "6a1465695bc739473150ffa6",
              title: "A premium office",
              description: "this is a very premium office",
              spaceType: "Hot Desk",
              capacity: 3,
              pricing: {
                rate: 1500,
                interval: "daily",
              },
              amenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
              images: [
                {
                  url: "https://ik.imagekit.io/h110m786/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  fileId: "6a1465695c7cd75eb81c63ff",
                  thumbnail:
                    "https://ik.imagekit.io/h110m786/tr:n-ik_ml_thumbnail/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  _id: "6a1465695bc739473150ffa7",
                },
              ],
              owner: "6a1005a202cf5937e13194e9",
              isAvailable: true,
              isRemoved: false,
              isLocked: false,
              location: {
                geo: {
                  coordinates: [75.8681996, 22.7203616],
                  type: "Point",
                },
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
              },
              createdAt: "2026-05-25T15:06:17.599Z",
              updatedAt: "2026-05-25T15:06:17.599Z",
              __v: 0,
            },
            resource: "Hot Desk",
            bookedBy: {
              _id: "6a0f1c1fad00834d4c687e73",
              username: "Hussain moiyedi",
              email: "vigreenhussainmoiyedi23@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJqEOO0qP1bSsJFNWHAO7Fkba-UoDsXe5Z5XFvIVkWQFBJ85dBq=s96-c",
              rating: 0,
            },
            owner: {
              _id: "6a1005a202cf5937e13194e9",
              username: "Shabbir Moiyedi",
              email: "shabbirmoiyedi110@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJUygRZxgm9gRGB4mXOGVLCOst2hRsy0mh6y5c59xSaISbDGy2I=s96-c",
              rating: 0,
            },
            fromDateTime: "2026-06-26T10:00:00.000Z",
            endDateTime: "2026-06-27T15:00:00.000Z",
            seatsBooked: 3,
            totalCapacitySnapshot: 3,
            remainingCapacitySnapshot: 0,
            bookingType: "daily",
            pricing: {
              basePrice: 3000,
              platformFee: 300,
              finalPrice: 3300,
              currency: "INR",
            },
            negotiation: {
              isNegotiable: false,
            },
            status: "pending",
            paymentStatus: "pending",
            lockExpiresAt: null,
            expiresAt: null,
            cancellationPolicy: {
              freeCancellationBeforeHours: 48,
              partialRefundBeforeHours: 24,
              partialRefundPercentage: 50,
              cancellationFee: 0,
            },
            workspaceSnapshot: {
              title: "A premium office",
              city: "Indore",
              state: "Madhya Pradesh",
              country: "India",
              selectedAmenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
            },
            notes: "Jo cjaje npj alsm",
            source: "web",
            isActive: true,
            createdAt: "2026-05-29T13:29:17.491Z",
            updatedAt: "2026-05-29T13:29:17.491Z",
            __v: 0,
          },
          {
            _id: "6a1994e31eebf92cbf76a5bc",
            space: {
              _id: "6a1465695bc739473150ffa6",
              title: "A premium office",
              description: "this is a very premium office",
              spaceType: "Hot Desk",
              capacity: 3,
              pricing: {
                rate: 1500,
                interval: "daily",
              },
              amenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
              images: [
                {
                  url: "https://ik.imagekit.io/h110m786/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  fileId: "6a1465695c7cd75eb81c63ff",
                  thumbnail:
                    "https://ik.imagekit.io/h110m786/tr:n-ik_ml_thumbnail/SwapStyle/listingImages/1779721575910_275_Po5oCsqGY",
                  _id: "6a1465695bc739473150ffa7",
                },
              ],
              owner: "6a1005a202cf5937e13194e9",
              isAvailable: true,
              isRemoved: false,
              isLocked: false,
              location: {
                geo: {
                  coordinates: [75.8681996, 22.7203616],
                  type: "Point",
                },
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
              },
              createdAt: "2026-05-25T15:06:17.599Z",
              updatedAt: "2026-05-25T15:06:17.599Z",
              __v: 0,
            },
            resource: "Hot Desk",
            bookedBy: {
              _id: "6a0f1c1fad00834d4c687e73",
              username: "Hussain moiyedi",
              email: "vigreenhussainmoiyedi23@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJqEOO0qP1bSsJFNWHAO7Fkba-UoDsXe5Z5XFvIVkWQFBJ85dBq=s96-c",
              rating: 0,
            },
            owner: {
              _id: "6a1005a202cf5937e13194e9",
              username: "Shabbir Moiyedi",
              email: "shabbirmoiyedi110@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJUygRZxgm9gRGB4mXOGVLCOst2hRsy0mh6y5c59xSaISbDGy2I=s96-c",
              rating: 0,
            },
            fromDateTime: "2026-06-26T10:00:00.000Z",
            endDateTime: "2026-06-27T15:00:00.000Z",
            seatsBooked: 3,
            totalCapacitySnapshot: 3,
            remainingCapacitySnapshot: 0,
            bookingType: "daily",
            pricing: {
              basePrice: 3000,
              platformFee: 300,
              finalPrice: 3300,
              currency: "INR",
            },
            negotiation: {
              isNegotiable: false,
            },
            status: "pending",
            paymentStatus: "pending",
            lockExpiresAt: null,
            expiresAt: null,
            cancellationPolicy: {
              freeCancellationBeforeHours: 48,
              partialRefundBeforeHours: 24,
              partialRefundPercentage: 50,
              cancellationFee: 0,
            },
            workspaceSnapshot: {
              title: "A premium office",
              city: "Indore",
              state: "Madhya Pradesh",
              country: "India",
              selectedAmenities: [
                "enterpriseWifi",
                "videoConferencing",
                "podcastStudio",
                "ergonomicFurniture",
              ],
            },
            notes: "Jo cjaje npj alsm",
            source: "web",
            isActive: true,
            createdAt: "2026-05-29T13:30:11.792Z",
            updatedAt: "2026-05-29T13:30:11.792Z",
            __v: 0,
          },
          {
            _id: "6a19b65dca50804e6ca4e4ca",
            space: {
              _id: "6a1466185bc739473150ffa8",
              title: "A very futuristic office",
              description: "this is a very good office",
              spaceType: "Private Office",
              capacity: 30,
              pricing: {
                rate: 15500,
                interval: "monthly",
              },
              amenities: ["baristaCoffee", "meditationRoom", "outdoorSpace"],
              images: [
                {
                  url: "https://ik.imagekit.io/h110m786/SwapStyle/listingImages/1779721750689_113_rmJB5i284",
                  fileId: "6a1466185c7cd75eb822ff1a",
                  thumbnail:
                    "https://ik.imagekit.io/h110m786/tr:n-ik_ml_thumbnail/SwapStyle/listingImages/1779721750689_113_rmJB5i284",
                  _id: "6a1466185bc739473150ffa9",
                },
              ],
              owner: "6a1005a202cf5937e13194e9",
              isAvailable: true,
              isRemoved: false,
              isLocked: false,
              location: {
                geo: {
                  coordinates: [75.8681996, 22.7203616],
                  type: "Point",
                },
                city: "Indore",
                state: "Madhya Pradesh",
                country: "India",
              },
              createdAt: "2026-05-25T15:09:12.486Z",
              updatedAt: "2026-05-25T15:09:12.486Z",
              __v: 0,
            },
            resource: "Private Office",
            bookedBy: {
              _id: "6a0f1c1fad00834d4c687e73",
              username: "Hussain moiyedi",
              email: "vigreenhussainmoiyedi23@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJqEOO0qP1bSsJFNWHAO7Fkba-UoDsXe5Z5XFvIVkWQFBJ85dBq=s96-c",
              rating: 0,
            },
            owner: {
              _id: "6a1005a202cf5937e13194e9",
              username: "Shabbir Moiyedi",
              email: "shabbirmoiyedi110@gmail.com",
              profilePicture:
                "https://lh3.googleusercontent.com/a/ACg8ocJUygRZxgm9gRGB4mXOGVLCOst2hRsy0mh6y5c59xSaISbDGy2I=s96-c",
              rating: 0,
            },
            fromDateTime: "2026-06-26T10:00:00.000Z",
            endDateTime: "2026-06-27T23:00:00.000Z",
            seatsBooked: 14,
            totalCapacitySnapshot: 30,
            remainingCapacitySnapshot: 16,
            bookingType: "monthly",
            pricing: {
              basePrice: 7233,
              platformFee: 723.3,
              finalPrice: 7956.3,
              currency: "INR",
            },
            negotiation: {
              isNegotiable: false,
            },
            status: "pending",
            paymentStatus: "pending",
            lockExpiresAt: null,
            expiresAt: null,
            cancellationPolicy: {
              freeCancellationBeforeHours: 48,
              partialRefundBeforeHours: 24,
              partialRefundPercentage: 50,
              cancellationFee: 0,
            },
            workspaceSnapshot: {
              title: "A very futuristic office",
              city: "Indore",
              state: "Madhya Pradesh",
              country: "India",
              selectedAmenities: [
                "baristaCoffee",
                "meditationRoom",
                "outdoorSpace",
              ],
            },
            notes: "Hey i want this space right now😥",
            source: "web",
            isActive: true,
            createdAt: "2026-05-29T15:53:01.347Z",
            updatedAt: "2026-05-29T15:53:01.347Z",
            __v: 0,
          },
        ]}
      />
    </div>
  );
};

export default Swaps;
