
interface OTPHeaderProps {
  phoneNumber: string;
}

const OTPHeader = ({ phoneNumber }: OTPHeaderProps) => {
  return (
    <div>
      <div className="mt-1 text-xs text-gray-500">
        Enter the 6-digit code sent to your phone
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {phoneNumber}
      </div>
    </div>
  );
};

export default OTPHeader;
