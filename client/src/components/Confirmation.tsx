const colors: { [key: string]: string } = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
};

type ModalProps = {
  color: string;
  yes: () => void;
  no: () => void;
  message: string;
};

const Confirmation: React.FC<ModalProps> = ({ color, yes, no, message }) => {
  let colours = "";

  switch (color) {
    case "red":
      colours = "red";
      break;
    case "blue":
      colours = "blue";
      break;
    case "green":
      colours = "green";
      break;
    default:
      colours = "red";
      break;
  }
  return (
    <div
      className={` absolute top-0 left-0 z-100 w-full h-full bg-white/10 backdrop-blur-xs flex items-center justify-center `}
    >
      <div
        className="absolute top-0 left-0 z-80 w-full h-full"
        onClick={no}
      ></div>
      <div className="w-1/4 h-1/4 flex flex-col z-90 bg-white">
        <div
          className={`px-2 py-1 border-2 rounded-t-md font-black uppercase text-white text-center border-${colours}-800 text-2xl text-white ${colors[color]}`}
        >
          Confirmation
        </div>
        <div
          className={` h-full w-full gap-4 bg-${colours}-100 border-x-2 border-b-2 shadow-md  rounded-b-md border-${colours}-800 flex items-center justify-center flex-col `}
        >
          <div className="font-semibold">{message}</div>
          <div className="flex gap-2 font-black text-white uppercase">
            <button
              className={` cursor-pointer bg-green-600 hover:bg-green-700 transition-all uppercase px-4 py-1 rounded-md border-2 border-green-800 `}
              onClick={yes}
            >
              Yes
            </button>
            <button
              onClick={no}
              className={` cursor-pointer bg-red-500 hover:bg-red-600 transition-all uppercase px-4 py-1 rounded-md border-2 border-red-800 `}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
