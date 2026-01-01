import { useDaumPostcodePopup } from "react-daum-postcode";

const useOpenDaumPostcode = (onComplete?: (address: string) => void) => {
  const open = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleAddressComplete = (data: {
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress === "" ? data.buildingName : `, ${data.buildingName}`;
      }
      if (extraAddress) {
        fullAddress += ` (${extraAddress})`;
      }
    }

    onComplete?.(fullAddress);
  };

  const handleOpenAddress = () => {
    open({ onComplete: handleAddressComplete });
  };

  return {
    handleOpenAddress,
  };
};

export default useOpenDaumPostcode;
