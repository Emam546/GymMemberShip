import { useFitWindow, useMergeRefs } from "@renderer/utils/hooks";
import { ComponentRef } from "react";
import { QRCodeSVG } from "qrcode.react";
function App(): JSX.Element {
  const ref = useMergeRefs(
    useFitWindow<ComponentRef<"div">>([], "width"),
    useFitWindow<ComponentRef<"div">>([], "height")
  );

  return (
    <>
      <div ref={ref} className="w-fit">
        <div className="max-w-md p-10 text-center bg-white shadow-2xl rounded-3xl">
          <h1 className="mb-8 text-3xl font-bold text-green-600">
            Scan WhatsApp QR Code
          </h1>
          <div className="flex justify-center mb-8">
            {/* Placeholder for the WhatsApp QR Code */}
            <div className="relative">
              <div className="flex items-center justify-center border-4 border-green-500 rounded-lg shadow-lg w-80 h-80">
                <QRCodeSVG
                  marginSize={0}
                  size={280}
                  value={window.context.qrCode}
                />
              </div>

              <div className="absolute inset-0 bg-green-400 rounded-lg opacity-10" />
            </div>
          </div>
          <p className="mb-4 text-lg font-medium text-gray-700">
            Open WhatsApp on your phone, go to settings, and tap{" "}
            <strong>Linked Devices</strong>.
          </p>
          <p className="mb-8 text-lg font-medium text-gray-700">
            Scan the code to log in to{" "}
            <span className="font-bold text-green-600">WhatsApp Web</span>.
          </p>
          {/* <button className="px-6 py-2 font-bold text-white transition duration-300 ease-in-out bg-green-500 rounded-full shadow-md hover:bg-green-600">
            Refresh QR Code
          </button> */}
        </div>

        {/* <div className="flex items-center justify-center">
          <div className="p-3 py-2 bg-red-600">
            <QRCodeSVG
              marginSize={0}
              size={300}
              className="bg-red-500"
              value={window.context.qrCode}
            />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default App;
