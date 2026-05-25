import { ArrowRightLeft } from "lucide-react";
import useSwap from "../hooks/useSwap";
import useAuth from "../../auth/hooks/useAuth";
import { useChatHttp } from "../../chats/hooks/useChatHttp";
import { useNavigate } from "react-router-dom";
import ShippingDetailsForm from "./shipping/ShippingDeatilsForm";
import ShippingAddressForm from "./shipping/ShippingAddressForm";
import { useState } from "react";
import ShippingAddressShowcase from "./shipping/ShippingAddressShowcase";
import CreateDisputeForm from "./disputes/CreateDisputeForm";
import ViewAllSwapDisputes from "./disputes/ViewAllSwapDisputes";
import RateUser from "./RateUser";
const SwapCard = ({ swap }) => {
  const { chatAccessHandler } = useChatHttp();
  const { user } = useAuth();
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showDisputes, setShowDisputes] = useState(false);

  let role = swap.role;
  let otherUserRole = role == "owner" ? "requester" : "owner";
  let status = swap.status;
  const navigate = useNavigate();
  const {
    acceptSwapHandler,
    rejectSwapHandler,
    cancelSwapHandler,
    completeSwapHandler,
    changeShipmentTypeHandler,
  } = useSwap();
  const diffrence = Math.abs(
    swap.ownerListing.estimatedValue - swap.requesterListing.estimatedValue,
  );
  const [showForm, setShowForm] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  return (
    <div className="bg-brand-700 rounded-2xl p-1 md:p-4 w-full max-w-6xl min-h-100 overflow-hidden text-white shadow-lg">
      {/* Profit / Loss */}
      <div className="mb-2 flex items-center justify-between">
        {diffrence < 100 ? (
          <span className="text-sm px-3 py-1 rounded-full bg-green-600">
            Fair Swap
          </span>
        ) : role === "owner" ? (
          <span className="text-sm px-3 py-1 rounded-full bg-red-600">
            Loss : {diffrence}
          </span>
        ) : (
          <span className="text-sm px-3 py-1 rounded-full bg-green-600">
            Profit: {diffrence}
          </span>
        )}
        <span className="text-brand-100">
          swap Id:
          <span className="text-accent-500 ml-2">{swap._id.slice(-6)}</span>
        </span>
      </div>
      {/* Listings */}
      <div className=" items-center flex justify-between w-full">
        <ListingCard item={swap.ownerListing} isOwner={role === "owner"} />
        {/* Swap Icon */}
        <ArrowRightLeft className="text-accent-400 w-1/5 h-12" />
        <ListingCard
          item={swap.requesterListing}
          isOwner={role === "requester"}
        />
      </div>
      {/* User + Message */}
      <div className="mt-3 text-sm text-gray-300">
        <p>Requested by {swap.requester.username}</p>
        <p className="text-xs italic">{swap.message}</p>
      </div>

      {/* CTA Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2 relative items-center justify-evenly lg:flex-row flex-col">
        <PendingCTAButton
          role={role}
          status={status}
          acceptSwapHandler={acceptSwapHandler}
          rejectSwapHandler={rejectSwapHandler}
          cancelSwapHandler={cancelSwapHandler}
          swap={swap}
        />
        <StatusShowcase
          status={status}
          user={user}
          swap={swap}
          otherUserRole={otherUserRole}
        />
        <ChatCta
          status={status}
          chatAccessHandler={chatAccessHandler}
          swap={swap}
          navigate={navigate}
          role={role}
          otherUserRole={otherUserRole}
        />
        <ShippingTypeUpdateCTA
          swap={swap}
          changeShipmentTypeHandler={changeShipmentTypeHandler}
        />

        {swap.status == "accepted" && swap.shipment_type == "shipping" && (
          <>
            {!swap.hasGivenAddress && (
              <button
                className="bg-brand-500 rounded-lg p-3 w-full source-code-pro "
                onClick={() => setShowForm(!showForm)}
              >
                Add Shipping Address
              </button>
            )}
            {swap.hasGivenAddress && (
              <p className="text-lg montserrat w-full text-center text-accent-500">
                Shipping Address Added. <br /> Waiting For Other User Response
              </p>
            )}
            {showForm && (
              <ShippingAddressForm
                setShowForm={setShowForm}
                swapId={swap._id}
              />
            )}
          </>
        )}

        {swap.status == "prepared_to_ship" && (
          <>
            {!swap.hasShipped && (
              <button
                className="bg-brand-500 w-full rounded-lg p-3 source-code-pro "
                onClick={() => setShowForm(!showForm)}
              >
                Add Shipment details
              </button>
            )}
            {!swap.hasRaisedDispute && (
              <button
                onClick={() => setShowDisputeForm(true)}
                className="bg-red-500 px-3 w-full py-2 rounded-lg whitespace-nowrap text-white"
              >
                Raise A dispute
              </button>
            )}
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="bg-brand-500 w-full rounded-lg p-3 source-code-pro "
            >
              View Other User's Address
            </button>
            {showAddress && (
              <ShippingAddressShowcase
                ownerAddress={swap.ownerAddress}
                requesterAddress={swap.requesterAddress}
                setShowAddress={setShowAddress}
                otherUserRole={otherUserRole}
              />
            )}
            {showForm && (
              <ShippingDetailsForm
                swapId={swap._id}
                setShowForm={setShowForm}
              />
            )}
          </>
        )}
        {swap.status === "disputed" && (
          <>
            <button
              onClick={() => setShowDisputes(true)}
              className="bg-accent-500 w-full text-brand-900 px-3 py-2 rounded-lg"
            >
              View All Disputes
            </button>
            {!swap.hasRaisedDispute && (
              <button
                onClick={() => setShowDisputeForm(true)}
                className="bg-red-500 px-3 w-full py-2 rounded-lg whitespace-nowrap text-white"
              >
                Raise A dispute
              </button>
            )}
            <p className="text-sm w-full montserrat text-accent-300 lg:absolute lg:-translate-x-1/2 left-1/2 -bottom-1/2">
              Waiting For Admin To Resolve Dispute
            </p>
          </>
        )}
        {swap.hasShipped && !swap.hasCompleted && status === "shipping" && (
          <>
            {swap.shipment_type == "shipping" && (
              <button
                onClick={() => {
                  let url = swap.shipments.find(
                    (shipment) => shipment.from.toString() !== user.toString(),
                  );
                  window.open(url.trackingUrl, "_blank");
                }}
                className="bg-brand-500 w-full whitespace-nowrap source-code-pro px-3 py-2 rounded-lg "
              >
                Track Order
              </button>
            )}
            {!swap.hasRaisedDispute && (
              <button
                onClick={() => setShowDisputeForm(true)}
                className="bg-red-500 w-full px-3 py-2 rounded-lg whitespace-nowrap text-white"
              >
                Raise A dispute
              </button>
            )}

            <button
              onClick={() => {
                let isConfirmed = confirm(
                  "Are you sure you want to continue? This Means You Have Recieved the Item.",
                );
                if (!isConfirmed) return;
                completeSwapHandler(swap._id);
              }}
              className="bg-yellow-500 w-full  md:whitespace-nowrap source-code-pro px-3 py-2 rounded-lg "
            >
              Complete Request
            </button>
          </>
        )}
        {showDisputeForm && (
          <CreateDisputeForm
            swapId={swap._id}
            setShowForm={setShowDisputeForm}
          />
        )}

        {showDisputes && (
          <ViewAllSwapDisputes
            swapId={swap._id}
            setShowDisputes={setShowDisputes}
          />
        )}
      </div>
    </div>
  );
};
function PendingCTAButton({
  role,
  status,
  acceptSwapHandler,
  rejectSwapHandler,
  cancelSwapHandler,
  swap,
}) {
  return (
    <>
      {role === "owner" && status === "pending" && (
        <>
          <button
            onClick={() => acceptSwapHandler(swap._id)}
            className="bg-accent-500 px-3 py-2 rounded-lg w-full"
          >
            Accept
          </button>
          <button
            onClick={() => rejectSwapHandler(swap._id)}
            className="bg-red-600 px-3 py-2 rounded-lg w-full"
          >
            Reject
          </button>
        </>
      )}
      {role === "requester" && status === "pending" && (
        <button
          onClick={() => cancelSwapHandler(swap._id)}
          className="bg-red-500 px-3 py-2 rounded-lg w-full "
        >
          Withdraw Request (cancel)
        </button>
      )}
    </>
  );
}
function StatusShowcase({ status, swap, otherUserRole, user }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {status === "completed" && (
        <>
          <span className="text-green-400 text-sm self-center">Completed</span>
          <RateUser
            swapId={swap._id}
            rateeId={swap[otherUserRole]._id}
            open={open}
            setOpen={setOpen}
            hasRated={swap.hasRatedUser}
          />
        </>
      )}
      {(status === "rejected" || status === "cancelled") && (
        <span className="text-red-400 text-sm">Declined</span>
      )}
      {status === "cancelled_by_admin" && (
        <span className="text-red-400 text-sm">
          The Swap Has Been Cancelled By Admin
        </span>
      )}
      {status === "refund_listing" && (
        <span className="text-red-400 text-sm">
          Admin orders To Refund Each Other Your Listing's
        </span>
      )}
    </>
  );
}
function ChatCta({
  status,
  chatAccessHandler,
  swap,
  role,
  otherUserRole,
  navigate,
}) {
  return (
    (status === "pending" ||
      status === "accepted" ||
      status === "prepare_to_ship" ||
      status === "shipping") && (
      <button
        onClick={async () => {
          const response = await chatAccessHandler(swap[otherUserRole]._id);
          navigate(`/chats/${response.chatId}`);
        }}
        className="text-sm  bg-accent-500 w-full text-brand-900 md:font-bold source-code-pro lg:whitespace-nowrap px-3 py-2 rounded-lg"
      >
        {status === "pending" || status === "accepted"
          ? "Negotiate With "
          : "Chat With "}
        {role == "owner" ? swap.requester.username : swap.owner.username}
      </button>
    )
  );
}
function ShippingTypeUpdateCTA({ swap, changeShipmentTypeHandler }) {
  {
    return (
      (swap.status === "accepted" ||
        (swap.status == "shipping" && swap.shipment_type === "local_swap")) && (
        <div className="flex flex-col  gap-2 w-full relative">
          <p className="text-sm md:absolute z-10 text-brand-200 text-center montserrat w-full">
            Change Shipment Type
          </p>
          <div className="relative w-full">
            <select
              value={swap.shipment_type}
              onChange={(e) =>
                changeShipmentTypeHandler(swap._id, e.target.value)
              }
              className="appearance-none w-full px-4 py-2 pr-10 rounded-lg 
                 bg-brand-800 text-white border border-border 
                  montserrat focus:outline-none cursor-pointer "
            >
              <option className="bg-brand-800 text-accent-500" value="shipping">
                🚚 Shipping
              </option>
              <option
                className="bg-brand-800 text-accent-500"
                value="local_swap"
              >
                🤝 Local Swap
              </option>
            </select>

            {/* custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
              ▼
            </div>
          </div>
        </div>
      )
    );
  }
}

function ListingCard({ item, isOwner }) {
  return (
    <div className="w-full relative lg:h-75 lg:w-[48%] bg-accent-500 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col lg:flex-row">
      {/* Image */}
      <div className="lg:w-1/2 h-52 lg:h-auto overflow-hidden">
        <img
          src={item.images[0].url}
          alt="productImage"
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>
      {isOwner && (
        <p className="top-1 left-1 rounded-2xl px-3 py-1 absolute bg-brand-900 text-accent-500">
          Your Listing
        </p>
      )}
      {/* Content */}
      <div className="flex flex-col justify-between p-4 lg:w-1/2">
        {/* Top Section */}
        <div className="space-y-2">
          {/* 💰 Price FIRST */}
          <p className="text-brand-900 font-bold text-xl flex flex-col">
            ₹ {item.estimatedValue}
            <span className="text-xs text-brand-300 ">Estimated Value</span>
          </p>

          {/* 🏷 Title */}
          <h2 className="text-md font-semibold text-brand-900 line-clamp-1">
            {item.title}
          </h2>

          {/* 🏷 Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-900  text-accent-500 text-xs px-3 py-1 rounded-full">
              {item.size}
            </span>
            <span className="bg-brand-900  text-accent-500 text-xs px-3 py-1 rounded-full">
              {item.brandName}
            </span>
            <span className="bg-brand-900  text-accent-500 text-xs px-3 py-1 rounded-full">
              {item.condition.split("_").join(" ")}
            </span>
          </div>

          {/* 📝 Description LAST */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
export default SwapCard;

/*

        {swap.hasShipped && swap.hasCompleted && status === "accepted" && (
          <>
            {swap.shipment_type == "shipping" && <button>View Shipment</button>}
          </>
        )} */
