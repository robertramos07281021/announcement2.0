import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import type { Dept } from "../../middlewares/types.ts";
import type { User } from "../../redux/slices/authSlice.ts";
import Confirmation from "../../components/Confirmation.tsx";
import useMutationFactory from "../../middlewares/mutations.ts";
import { toast } from "react-toastify";

enum AccountType {
  ADMIN = "ADMIN",
  USER = "USER",
}

type Data = {
  username: string | null;
  type: AccountType | null;
  name: string | null;
  department: string | null;
};

const GET_USERS = gql`
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

const GET_DEPARTMENTS = gql`
  query getDepts {
    getDepts {
      _id
      branch {
        _id
        name
      }
      name
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation updateAccount($id: ID!, $input: InputCreatingAccount) {
    updateAccount(id: $id, input: $input) {
      message
      success
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation createAccount($input: InputCreatingAccount) {
    createAccount(input: $input) {
      message
      success
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation deleteAccount($_id: ID!) {
    deleteAccount(_id: $_id) {
      message
      success
    }
  }
`;

const AccountsPage = () => {
  const [addAccount, setAddAccount] = useState<boolean>(false);
  const [toUpdateAccount, setToUpdateAccount] = useState<User | null>(null);
  const [toDeleteAccount, setToDeleteAccount] = useState<User | null>(null);
  const [data, setData] = useState<Data>({
    username: null,
    type: null,
    name: null,
    department: null,
  });

  const { data: usersData, refetch: usersRefetch } = useQuery<{
    findUsers: User[];
  }>(GET_USERS, {
    notifyOnNetworkStatusChange: true,
  });

  const { data: deptsData, refetch: deptsRefetch } = useQuery<{
    getDepts: Dept[];
  }>(GET_DEPARTMENTS, { notifyOnNetworkStatusChange: true });

  const Refetching = useCallback(async () => {
    await deptsRefetch();
    await usersRefetch();
  }, [deptsRefetch, usersRefetch]);

  useEffect(() => {
    Refetching();
  }, []);

  const whenComplete = useCallback(
    (message: string) => {
      Refetching();
      setData({
        username: null,
        type: null,
        name: null,
        department: null,
      });
      setAddAccount(false);
      setToUpdateAccount(null);
      setToDeleteAccount(null);

      toast(message);
    },
    [Refetching, setAddAccount, setToUpdateAccount, setToDeleteAccount],
  );

  const [createAccount] = useMutationFactory(
    CREATE_ACCOUNT,
    "createAccount",
    whenComplete,
  );

  const [updateAccount] = useMutationFactory(
    UPDATE_DEPARTMENT,
    "updateAccount",
    whenComplete,
  );

  const [deleteAccount] = useMutationFactory(
    DELETE_ACCOUNT,
    "deleteAccount",
    whenComplete,
  );

  const SubmitDeleteAccount = useCallback(async () => {
    await deleteAccount({ variables: { _id: toDeleteAccount?._id } });
  }, [deleteAccount, toDeleteAccount]);

  const SubmitUpdateAccount = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await updateAccount({
        variables: { id: toUpdateAccount?._id, input: data },
      });
    },
    [updateAccount, data, toUpdateAccount],
  );
  const SubmitCreatingAccount = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await createAccount({ variables: { input: data } });
    },
    [data, createAccount],
  );

  return (
    <>
      {toDeleteAccount && (
        <Confirmation
          color="red"
          yes={SubmitDeleteAccount}
          no={() => setToDeleteAccount(null)}
          message={`Are you sure you want to delete account?`}
        />
      )}
      {(addAccount || toUpdateAccount) && (
        <div className="absolute w-full h-full top-0 left-0 overflow-hidden z-100">
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="absolute cursor-pointer w-full h-full z-10 top-0 left-0 bg-black/10 backdrop-blur-xs"
              onClick={() => {
                setAddAccount(false);
                setToUpdateAccount(null);
              }}
            ></div>
            <form
              className="border-2 border-blue-800 rounded-md overflow-hidden shadow-2xl shadow-black/30 z-20 flex flex-col bg-white"
              onSubmit={
                addAccount && !toUpdateAccount
                  ? SubmitCreatingAccount
                  : SubmitUpdateAccount
              }
            >
              <p className="bg-blue-500 w-full border-b-2 border-blue-800 text-center py-2 font-black uppercase text-white">
                {addAccount && !toUpdateAccount
                  ? "Create an Account"
                  : "Update Account"}
              </p>
              <div className="w-full bg-blue-100 h-full flex flex-col items-center justify-center p-5">
                <div className=" grid grid-cols-2 gap-2">
                  <div className="w-full flex flex-col text-left">
                    <div>Username:</div>
                    <input
                      type="text"
                      id="username"
                      autoComplete="off"
                      name="username"
                      value={data.username ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value.trim() === "" ? null : e.target.value;
                        setData((prev) => ({ ...prev, username: value }));
                      }}
                      className="bg-white px-3 py-1 outline-none border rounded-sm shadow-md"
                    />
                  </div>

                  <div className="w-full flex flex-col text-left">
                    <div>Name:</div>
                    <input
                      type="text"
                      id="name"
                      autoComplete="off"
                      name="name"
                      value={data.name ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value.trim() === "" ? null : e.target.value;
                        setData((prev) => ({ ...prev, name: value }));
                      }}
                      className="bg-white px-3 py-1 outline-none border rounded-sm shadow-md"
                    />
                  </div>
                  <div className="w-full flex flex-col text-left">
                    <div>Type:</div>
                    <select
                      name="type"
                      id="type"
                      className="border bg-white rounded-sm shadow-md px-3 py-1 outline-none"
                      value={data.type ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value.trim() === ""
                            ? null
                            : (e.target.value as AccountType);
                        setData((prev) => ({ ...prev, type: value }));
                      }}
                    >
                      {Object.entries(AccountType).map(([key, value]) => {
                        return (
                          <option value={value} key={key}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="w-full flex flex-col text-left">
                    <div>Department:</div>
                    <select
                      name="department"
                      id="department"
                      value={data.department ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value.trim() === "" ? null : e.target.value;
                        setData((prev) => ({ ...prev, department: value }));
                      }}
                      className="border bg-white rounded-sm shadow-md px-3 py-1 outline-none"
                    >
                      {deptsData?.getDepts.map((x) => {
                        return (
                          <option value={x._id} key={x._id}>
                            {x.name} - {x?.branch?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full bg-blue-100 flex items-center px-4 pb-4">
                <button
                  type="submit"
                  className="p-2 w-full px-3 bg-green-600 cursor-pointer hover:bg-green-700 transition-all font-black uppercase text-white rounded-md shadow-md border-green-800 border-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="p-4 flex bg-gray-100 w-full h-full">
        <div className=" flex w-full overflow-hidden flex-col relative">
          <h1 className="text-2xl font-black uppercase">Accounts</h1>
          <div className="text-end flex w-full justify-end">
            <div
              className="py-1.5 border-2 cursor-pointer bg-green-600 hover:bg-green-700 transition-all font-black uppercase text-white rounded-md shadow-md border-green-800 px-7 "
              onClick={() => {
                setAddAccount((prev) => !prev);
              }}
            >
              create
            </div>
          </div>
          <div className="flex flex-col h-full w-full mt-2 overflow-y-auto overflow-x-hidden">
            <div className="grid rounded-t-md text-shadow-xs border-2 border-blue-800 text-shadow-black grid-cols-5 px-3 py-1 font-black uppercase text-white bg-blue-500 sticky to-pink-100 top-0">
              <div>Name</div>
              <div>Username</div>
              <div>Type</div>
              <div>Department</div>
              <div className="text-right mr-3.5">Action</div>
            </div>
            {usersData?.findUsers.map((user, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-5 border-x-2 last:border-b-2 last:rounded-b-md last:shadow-md hover:bg-blue-300 items-center font-semibold transition-all border-blue-800 px-3 py-1 odd:bg-blue-100 even:bg-blue-200 "
                >
                  <div className="first-letter:uppercase">{user.name}</div>
                  <div>{user.username}</div>
                  <div>{user.type}</div>
                  <div>
                    {user.department.name} - {user?.department?.branch?.name}
                  </div>
                  <div className="flex gap-2 justify-end py-1">
                    <button
                      onClick={() => {
                        setToUpdateAccount(user);
                        setData((prev) => ({
                          ...prev,
                          username: user.username,
                          type: user.type as AccountType,
                          name: user.name,
                          department: user.department._id,
                        }));
                      }}
                      className="border-blue-800 border-2 hover:bg-blue-600 bg-blue-500 overflow-hidden rounded-md"
                    >
                      <div className="p-2 hover:animate-spin transition-all cursor-pointer  text-white font-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setToDeleteAccount(user);
                      }}
                      className="border-red-800 border-2 p-2 cursor-pointer text-white hover:bg-red-600 bg-red-500 overflow-hidden rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
