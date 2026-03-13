import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import type { ForSideMain, TVMonitors } from "../../middlewares/types.ts";
import { useEffect, type JSX } from "react";
import type { User } from "../../redux/slices/authSlice.ts";

const ANNOUCEMENTS = gql`
  query getAllAnnouncement {
    getAllAnnouncement {
      _id
      department {
        name
        _id
        branch {
          _id
          name
        }
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

const ALL_ACCOUNTS = gql`
  query findUsers {
    findUsers {
      department {
        branch {
          _id
          name
        }
        _id
        name
      }
      name
      type
      username
      _id
      onTv
    }
  }
`;

const LandingPage = () => {
  const { data, refetch } = useQuery<{ getAllAnnouncement: TVMonitors[] }>(
    ANNOUCEMENTS,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  const { data: allUsersData, refetch: allUsersRefetch } = useQuery<{
    findUsers: User[];
  }>(ALL_ACCOUNTS, { notifyOnNetworkStatusChange: true });

  useEffect(() => {
    const refetching = async () => {
      await refetch();
      await allUsersRefetch();
    };
    refetching();
  }, []);

  const Main = (main: ForSideMain) => {
    const display: Record<string, JSX.Element> = {
      text: (
        <div className="text-xs items-center flex justify-center h-full w-full text-center font-bold p-2">
          {main?.value}
        </div>
      ),
      images: (
        <img
          src={`/uploads/${main?.value}`}
          alt="image"
          className="p-2 w-full h-full"
        />
      ),
      video: (
        <video controls loop muted autoPlay className="h-full w-full p-2 ">
          <source src={`/uploads/${main?.value}`} type="video/mp4" />
        </video>
      ),
    };

    return display[main?.type as string];
  };

  return (
    <div className="w-full  bg-gray-100 p-4">
      <div className="flex gap-4 h-full w-full flex-col">
        <div className="font-black uppercase text-black text-2xl">
          Dashboard
        </div>
        <div className="grid grid-cols-6 gap-4 w-full h-full grid-rows-4">
          {data?.getAllAnnouncement.map((announcement) => {
            const users = allUsersData?.findUsers.filter(x=> x.department._id === announcement.department._id).map(y=> y.onTv)
           
            return (
              <div
                key={announcement._id}
                className=" w-full rounded-md shadow-sm hover:scale-105 flex flex-col transition-all border border-slate-300 bg-slate-200 h-full"
              >
                {" "}
                <h1 className="text-sm border border-slate-200 font-bold text-center rounded bg-slate-500 text-white m-2">
                  {announcement.department.name} -{" "}
                  {announcement.department.branch.name}
                </h1>
                {(announcement?.main && users && users?.includes(true)) ? Main(announcement?.main) : 
                  <div className="w-full h-full font-medium text-center flex items-center justify-center italic text-slate-400">The TV is not used..</div>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
