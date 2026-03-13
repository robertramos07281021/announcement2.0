import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { setUserLogged } from "../redux/slices/authSlice.ts";
import { useAppDispatch } from "../redux/store.ts";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../src/Animations/Awareness campaign social marketing.json";
import animationDataBG from "../../src/Animations/Animated dark abstract background.json";
import type { Success } from "../middlewares/types.ts";

type Credentials = {
  username: string | null;
  password: string | null;
};

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      message
      success
      user {
        department {
          branch {
            _id
            name
          }
          name
          _id
        }
        name
        token
        username
        type
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    username: null,
    password: null,
  });

  const dispatch = useAppDispatch();
  const [onError, setOnError] = useState<string | null>(null);
  const [hide, setHide] = useState<boolean>(false);

  const [login] = useMutation<{ login: Success }>(LOGIN, {
    onCompleted: (data) => {
      dispatch(setUserLogged(data?.login.user));
      setOnError(null);
      if (data.login.user.type === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/config-upload-user");
      }
    },
    onError: (err) => {
      setOnError(err.message);
      setCredentials({
        username: null,
        password: null,
      });
    },
  });

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await login({
        variables: {
          username: credentials.username,
          password: credentials.password,
        },
      });
    },
    [credentials, login],
  );
  return (
    <div className="flex bg-white gap-4 w-screen h-screen">
      <div className="fixed inset-0 z-10 pointer-events-none">
        <Lottie animationData={animationDataBG} />
      </div>
      <div className=" py-10 px-5 z-20 justify-between bg-blue-800 w-[30%] overflow-hidden flex flex-col items-center text-white">
        <div className="font-black text-center text-white">
          <div className=" text-xs md:text-3xl text-shadow-md uppercase text-shadow-black/40">
            Announcement system 2.0
          </div>
          <div className="font-semibold xl:px-10 text-xs text-white text-shadow-sm text-shadow-black/40">
            This platform keeps everyone informed with the latest updates,
            important notices, and system announcements in one centralized
            place. Stay connected and never miss important information.
          </div>
        </div>
        <Lottie animationData={animationData} />
      </div>
      <div className=" w-[70%] flex items-center z-20 justify-center">
        <form
          className="bg-white shadow-black/40 shadow-md relative font-black p-15 rounded-sm flex flex-col items-center justify-center"
          onSubmit={onSubmit}
        >
          <img className="h-24" src="/ASPhoto.png" />
          <div className="uppercase my-4 text-blue-900">Login your account</div>
          {onError && (
            <h1 className="py-2 font-light text-xs text-red-700">{onError}</h1>
          )}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex w-full font-normal flex-col">
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const newValue = value.trim() === "" ? null : value;
                  setCredentials((prev) => ({ ...prev, username: newValue }));
                }}
                placeholder="Username"
                className={` border-gray-300 text-black border px-3 py-2 outline-none rounded-sm `}
              />
            </div>
            <div className="flex w-full flex-col">
              <div className="flex w-full font-normal flex-col relative">
                <input
                  type={hide ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newValue = value.trim() === "" ? null : value;
                    setCredentials((prev) => ({ ...prev, password: newValue }));
                  }}
                  placeholder="Password"
                  className={` border-gray-300   text-black border px-3 py-2 outline-none rounded-sm `}
                />
                <input
                  type="checkbox"
                  checked={hide}
                  onChange={(e) => {
                    setHide(e.target.checked ? true : false);
                  }}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 peer"
                />
                <p className="peer-hover:flex hidden absolute -translate-y-1/2 top-1/2 right-10 text-slate-500 font-medium ">Show Password</p>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <button
              type="submit"
              className="bg-blue-700 cursor-pointer hover:bg-blue-800 transition-all font-black rounded-sm text-white shadow-md py-2 w-full"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
