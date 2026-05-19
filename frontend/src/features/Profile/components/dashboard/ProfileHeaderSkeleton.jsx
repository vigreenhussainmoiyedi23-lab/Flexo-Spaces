import Skeleton from "react-loading-skeleton";

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center">
      
      {/* Left side */}
      <div className="flex gap-4 items-center">
        <Skeleton circle width={80} height={80} />

        <div className="space-y-2">
          <Skeleton width={120} height={18} />
          <Skeleton width={180} height={14} />
          <Skeleton width={220} height={14} />
        </div>
      </div>

      {/* Right buttons */}
      <div className="flex flex-col gap-2">
        <Skeleton width={120} height={35} />
        <Skeleton width={120} height={35} />
        <Skeleton width={120} height={35} />
      </div>

    </div>
  );
};