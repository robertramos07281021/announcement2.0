import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, type RootState } from "../redux/store.ts";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client/react";
import { setLogout, type User } from "../redux/slices/authSlice.ts";
import { useCallback, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";

const NavbarButtons = ({
  text,
  link,
  onClick,
}: {
  text: string;
  link: string;
  onClick: () => void;
}) => {
  {
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <div
        className={`w-full px-4 py-2 hover:text-white hover:bg-blue-500 transition-all rounded cursor-pointer text-nowrap ${location.pathname.toLowerCase().includes(text.toLowerCase()) ? "shadow text-white bg-blue-500 " : ""}`}
        onClick={() => {
          navigate(link);
          onClick();
        }}
      >
        {text}
      </div>
    );
  }
};

const LOGOUT = gql`
  mutation logout {
    logout {
      message
      success
    }
  }
`;

const FIND_ME = gql`
  query findMe {
    findMe {
      _id
      name
      type
      token
      username
    }
  }
`;

const ON_TV = gql`
  mutation onTvNavigate($value: Boolean) {
    onTvNavigate(value:$value) {
      message
      success
    }
  }
`;

const Navbar = () => {
  const { userLogged } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      dispatch(setLogout());
      navigate("/");
    },
  });

  const { refetch: myDataRefetching } = useQuery<{ findMe: User }>(FIND_ME, {
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userLogged) {
        const res = await myDataRefetching();
        if (!res?.data?.findMe) {
          navigate("/");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [onTvNavigate] = useMutation(ON_TV);

  const changeOnTV = useCallback(
    async (link: string) => {
      const value = link === "/tv-monitor"
      await onTvNavigate({variables: {value:value}});
    },
    [onTvNavigate],
  );

  const adminNavigators = [
    { text: "Dashboard", link: "/dashboard" },
    { text: "Accounts", link: "/accounts" },
    { text: "Dept & Branch", link: "/dept-branch" },
    { text: "Upload Configuration", link: "/config-upload" },
    { text: "TV Monitor", link: "/tv-monitor" },
  ];

  const userNavigator = [
    { text: "Uploader", link: "/config-upload-user" },
    { text: "TV Monitor", link: "/tv-monitor" },
  ];

  const navigators =
    userLogged?.type === "ADMIN" ? adminNavigators : userNavigator;

  return (
    <div
      className={`h-full w-80 z-40 py-6 px-4 flex flex-col overflow-hidden hover:opacity-100 bg-white ${location.pathname.includes("tv-monitor") ? "opacity-0 duration-200" : ""} border-r border-slate-300`}
    >
      <div className="flex items-center justify-center p-2 mb-10">
        <img src="/ASPhoto.png" alt="Bernales Logo" />
      </div>
      <div className="h-full font-black uppercase flex flex-col overflow-auto gap-1.5">
        {navigators.map((nav, index) => {
          return (
            <NavbarButtons
              key={index}
              onClick={() => changeOnTV(nav.link)}
              text={nav.text}
              link={nav.link}
            />
          );
        })}
      </div>
      <div className="h-1/12 items-center gap-2 text-slate-500 font-medium justify-center flex">
        <div
          className="flex gap-2 items-center border-2 px-8 py-1.5 rounded-md bg-slate-500 text-white justify-center cursor-pointer hover:bg-white border-slate-500 hover:text-slate-500 transition-all duration-300"
          onClick={async () => await logout()}
        >
          <IoLogOut className="text-2xl" />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
