import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ onSave }) => {
  const sigCanvas = useRef();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the delivery ID from URL params

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature first!");
      return;
    }
    const signatureDataURL = sigCanvas.current.toDataURL("image/png");

    // Call the onSave function to pass the signature data
    onSave(signatureDataURL);

    // Optionally, navigate back to the delivery screen after saving the signature
    navigate(`/delivery-screen/${id}`);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 200,
          className: "border border-black rounded-md",
        }}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
