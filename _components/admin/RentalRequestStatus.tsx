interface RentalRequestStatusProps {
  status?: string;
}

const RentalRequestStatus = ({
  status,
}: RentalRequestStatusProps) => {
  const normalizedStatus =
    status?.toUpperCase() || "UNKNOWN";

  const getStatusClass = () => {
    switch (normalizedStatus) {
      case "APPROVED":
      case "ACCEPTED":
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass()}`}
    >
      {normalizedStatus}
    </span>
  );
};

export default RentalRequestStatus;