import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../redux/store.ts";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import React, { useEffect, useRef, useState, type JSX } from "react";
import gql from "graphql-tag";
import { useQuery, useSubscription } from "@apollo/client/react";
import type { Dept } from "../middlewares/types.ts";
import { setNewsUpdate } from "../redux/slices/authSlice.ts";

const MONITORS = gql`
  query getMonitorValues {
    getMonitorValues {
      _id
      department {
        _id
        name
      }
      main {
        mute
        type
        value
      }
      side {
        mute
        type
        value
      }
    }
  }
`;

type ForSideMain = {
  mute: boolean;
  type: string;
  value: string;
};

type TVMonitors = {
  _id: string;
  department: Dept;
  main: ForSideMain;
  side: ForSideMain;
};

const NEW_ANNOUNCE = gql`
  subscription newAnnouncement {
    newAnnouncement {
      message
    }
  }
`;

const TVMonitor = () => {
  const { userLogged, newsUpdate } = useSelector(
    (state: RootState) => state.auth,
  );

  const [showAudio, setShowAudio] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { data, refetch } = useQuery<{ getMonitorValues: [TVMonitors] }>(
    MONITORS,
    {
      notifyOnNetworkStatusChange: true,
      skip: !userLogged,
    },
  );

  const monitorsData = data?.getMonitorValues;
  const newsUpdatesAudioRef = useRef<HTMLAudioElement>(null);

  useSubscription<{ newAnnouncement: { message: string } }>(NEW_ANNOUNCE, {
    onData: async ({ data }) => {
      if (data) {
        if (data.data?.newAnnouncement.message === "NEW_ANNOUNCEMENT") {
          await refetch();
          window.location.reload()
          setShowAudio(true);
        }
      }
    },
  });
  // playSound();
  useEffect(() => {
    if (!data?.getMonitorValues) {
      const refetching = async () => {
        await refetch();
      };
      refetching();
    } else {
      if (newsUpdate !== data.getMonitorValues) {
        setShowAudio(true);
        dispatch(setNewsUpdate(data.getMonitorValues));
        if (showAudio) {
          setTimeout(() => {
            setShowAudio(false);
          }, 3000);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (showAudio) {
      setTimeout(() => {
        setShowAudio(false);
      }, 3000);
    }
  }, [showAudio]);

  // useEffect(() => {
  //   const refetching = async () => {
  //     await refetch();
  //   };
  //   refetching();
  // }, []);

  const IT_DEPT_ANNOUNCEMENT = data?.getMonitorValues.find(
    (x) => x.department.name === "ADMIN",
  );
  const HR_DEPT_ANNOUNCEMENT = data?.getMonitorValues.find(
    (x) => x.department.name === "HR",
  );
  const SSD_DEPT_ANNOUNCEMENT = data?.getMonitorValues.find(
    (x) => x.department.name === "SSD",
  );
  const OPS_DEPT_ANNOUNCEMENT = data?.getMonitorValues.find(
    (x) => x.department.name === "OPERATIONS",
  );
  const MY_DEPT_ANNOUNCEMENT = data?.getMonitorValues.find(
    (x) => x.department._id == userLogged?.department._id,
  );

  const itVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const hrVideoRef = useRef<HTMLVideoElement>(null);
  const ssdVideoRef = useRef<HTMLVideoElement>(null);
  const opsVideoRef = useRef<HTMLVideoElement>(null);

  const handleUserGesture = async () => {
    if (itVideoRef?.current) {
      await itVideoRef?.current?.play();
    }
    if (mainVideoRef?.current) {
      await mainVideoRef?.current?.play();
    }
    if (hrVideoRef?.current) {
      await hrVideoRef?.current?.play();
    }
    if (ssdVideoRef?.current) {
      await ssdVideoRef?.current?.play();
    }
    if (opsVideoRef?.current) {
      await opsVideoRef?.current?.play();
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      handleUserGesture();
    });
    return () => clearTimeout(timer);
  }, []);

  const display = async (
    forDisplay: ForSideMain,
    ref: React.RefObject<HTMLVideoElement | null>,
  ) => {
    const onClick = () => {
      const video = ref.current;
      if (video) {
        video.muted = false;
        video.play().catch((err) => console.log(err));
      }
      document.removeEventListener("click", onClick);
    };

    document.addEventListener("click", onClick);

    const result: Record<string, JSX.Element> = {
      images: (
        <img
          src={`/uploads/${forDisplay?.value}`}
          alt="images"
          className="w-full h-full"
        />
      ),
      video: (
        <video ref={ref} className="h-full p-2 w-full" autoPlay loop muted>
          <source src={`/uploads/${forDisplay?.value}`} type="video/mp4" />
        </video>
      ),
      text: (
        <p className="w-full h-full flex items-center justify-center text-center font-bold text-3xl p-5">
          {forDisplay?.value}
        </p>
      ),
    };

    return result[forDisplay?.type as string];
  };

  return userLogged ? (
    <div className="flex w-screen h-screen relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 bg-gray-100 left-0 z-0 w-full h-full p-4">
        <div className="grid grid-cols-3 h-full gap-4 grid-rows-4">
          <div className="col-span-3 row-span-2 flex gap-4">
            <div
              // onMouseEnter={() => setShowBackground("one")}
              // onMouseLeave={() => setShowBackground("")}
              className="bg-white shadow-md flex items-end hover:scale-101 transition-all w-full relative overflow-hidden rounded-md"
            >
              {monitorsData &&
                MY_DEPT_ANNOUNCEMENT &&
                display(
                  MY_DEPT_ANNOUNCEMENT?.main as ForSideMain,
                  mainVideoRef,
                )}
              <div
                className={` h-full transition-all bg-linear-to-t absolute flex items-end justify-center from-amber-600/40 via-transparent to-transparent  w-full `}
              >
              </div>
            </div>
            <div
     
              className="bg-white shadow-md flex items-end hover:scale-101 transition-all w-full relative overflow-hidden rounded-md"
            >
              {(monitorsData && HR_DEPT_ANNOUNCEMENT?.side.value) &&
                display(HR_DEPT_ANNOUNCEMENT?.side as ForSideMain, hrVideoRef)}
              <div
                className={` h-full transition-all bg-linear-to-t absolute flex items-end justify-center from-fuchsia-600/40 via-transparent to-transparent  w-full `}
              >
                <div className="mb-4 text-xl font-black uppercase">
                  HR UPDATES
                </div>
              </div>
            </div>
          </div>
          <div
  
            className="bg-white shadow-md flex items-end hover:scale-101 transition-all w-full relative overflow-hidden rounded-md row-span-2"
          >
            {OPS_DEPT_ANNOUNCEMENT &&
              display(OPS_DEPT_ANNOUNCEMENT?.side as ForSideMain, opsVideoRef)}
            <div
              className={` h-full transition-all bg-linear-to-t absolute flex items-end justify-center from-blue-600/40 via-transparent to-transparent  w-full `}
            >
              <div className="mb-3 text-xl font-black uppercase">
                OPERATIONS UPDATES
              </div>
            </div>
          </div>
          <div
       
            className="bg-white shadow-md flex items-end hover:scale-101 transition-all w-full relative overflow-hidden rounded-md row-span-2"
          >
            {monitorsData &&
              SSD_DEPT_ANNOUNCEMENT &&
              display(SSD_DEPT_ANNOUNCEMENT?.side as ForSideMain, ssdVideoRef)}
            <div
              className={`  h-full transition-all bg-linear-to-t absolute flex items-end justify-center from-red-600/40 via-transparent to-transparent  w-full `}
            >
              <div className="mb-3 text-xl font-black uppercase">SSD</div>
            </div>
          </div>
          <div
    
            className="bg-white shadow-md flex items-end hover:scale-101 transition-all w-full relative overflow-hidden rounded-md row-span-2"
          >
            {itVideoRef &&
              IT_DEPT_ANNOUNCEMENT &&
              display(IT_DEPT_ANNOUNCEMENT?.side as ForSideMain, itVideoRef)}

            <div
              className={` h-full transition-all bg-linear-to-t absolute flex items-end justify-center from-green-600/40 via-transparent to-transparent  w-full `}
            >
              <div className="mb-3 text-xl font-black uppercase">
                IT Department
              </div>
            </div>
          </div>
          <div className=""></div>
          {showAudio && (
            <audio
              ref={newsUpdatesAudioRef}
              autoPlay
              controls
              className="flex items-center justify-center border w-full absolute -right-full"
            >
              <source src="/newsUpdates.mp3" type="audio/mpeg" />
            </audio>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default React.memo(TVMonitor);
