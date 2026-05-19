import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import Button from "../components/Button";
import DisputeDetail from "../components/DisputeDetailsForn";

export default function Disputes() {
  const { GetAllDisputesHandler, disputes, loading } = useAdmin();
  useEffect(() => {
    GetAllDisputesHandler();
  }, []);
  const [currentDisputeId, setCurrentDisputeId] = useState(null);
  const [actionToBeDone, setActionToBeDone] = useState("resolved");
  if (loading)
    return (
      <div className="bg-brand-900 text-5xl flex items-center justify-center animate-pulse min-h-screen w-full text-white ">
        loading...
      </div>
    );
  return (
    <div>
      <h1 className="playfair text-3xl mb-6">Disputes</h1>

      <div className="bg-brand-800 p-4 rounded text-black flex flex-col gap-3">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="p-4 bg-accent-500 relative border-b rounded-lg flex items-center justify-between"
          >
            <div>
              <p className=" font-semibold text-brand-900 mb-3 capitalize stroke-1">
                disputeId:{d._id.slice(-5)}
              </p>
              <p className="montserrat font-semibold">{d.type}</p>
              <p>{d.role}</p>
              <p>{d.reason}</p>
              <p className="text-sm text-gray-500">{d.status}</p>
            </div>
            <div className="flex gap-2">
              {d.status == "open" && (
                <>
                  <Button
                    onClick={() => {
                      setCurrentDisputeId(d._id);
                      setActionToBeDone("resolved");
                    }}
                    variant="secondary"
                  >
                    resolve
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentDisputeId(d._id);
                      setActionToBeDone("rejected");
                    }}
                    variant="danger"
                  >
                    reject
                  </Button>
                </>
              )}
              {d.status != "open" && (
                <div className="flex flex-col gap-4 items-start justify-center">
                  <p className="capitalize relative  px-3 pt-6 pb-2 rounded-lg">
                    <span className="absolute top-1 left-1 text-gray-200 text-sm">
                      resolution -
                    </span>{" "}
                    {d.resolution.split("_").join(" ")}
                  </p>
                  <p className="capitalize relative  px-3 pt-6 pb-2 rounded-lg">
                    <span className="absolute top-1 left-1 text-gray-200 text-sm">
                      Admin Note -
                    </span>
                    {d.adminNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        {disputes.length == 0 && (
          <p className="text-white">No disputes found.</p>
        )}
      </div>
      {currentDisputeId && (
        <DisputeDetail
          disputeId={currentDisputeId}
          actionToBeDone={actionToBeDone}
          setCurrentDisputeId={setCurrentDisputeId}
        />
      )}
    </div>
  );
}
