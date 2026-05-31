function UserCTA({ status }) {
  return (
    <>
      {status === "pending" && (
        <button
          onClick={() => console.log("Withdraw")}
          className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
        >
          Withdraw
        </button>
      )}
    </>
  );
}

export default UserCTA;
