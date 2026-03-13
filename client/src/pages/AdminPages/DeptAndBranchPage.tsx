import {useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { useCallback, useEffect, useState } from "react";
import type { Branch, Dept } from "../../middlewares/types.ts";
import Confirmation from "../../components/Confirmation.tsx";
import { toast } from "react-toastify";
import useMutationFactory from "../../middlewares/mutations.ts";

const ADD_BRANCH = gql`
  mutation createNewBranch($name: String) {
    createNewBranch(name: $name) {
      message
      success
    }
  }
`;

const GET_BRANCHES = gql`
  query GetBranches {
    getBranches {
      _id
      name
    }
  }
`;

const UPDATE_BRANCH = gql`
  mutation updateBranch($input: InputBranch) {
    updateBranch(input: $input) {
      success
      message
    }
  }
`;

const DELETE_BRANCH = gql`
  mutation deleteBranch($id: ID!) {
    deleteBranch(id: $id) {
      message
      success
    }
  }
`;

const CREATE_DEPT = gql`
  mutation createNewDepartment($input: InputDepartment) {
    createNewDepartment(input: $input) {
      message
      success
    }
  }
`;

const GET_DEPTS = gql`
  query getDepts {
    getDepts {
      _id
      name
      branch {
        _id
        name
      }
    }
  }
`;

const UPDATE_DEPT = gql`
  mutation updateDepartment($input: InputDepartment) {
    updateDepartment(input: $input) {
      message
      success
    }
  }
`;

const DELETE_DEPT = gql`
  mutation deleteDepartment($_id: ID!) {
    deleteDepartment(_id: $_id) {
      message
      success
    }
  }
`;

const DeptAndBranchPage = () => {
  const [mutation, setMutation] = useState<"ADD" | "UPDATE" | null>(null);
  const [toMutate, setToMutate] = useState<"BRANCH" | "DEPARTMENT" | null>(
    null,
  );
  const [toUpdate, setToUpdate] = useState<Dept | Branch | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [selectingBranch, setSelectingBranch] = useState<string | null>(null);

  const { data: branchesData, refetch: branchesRefetch } = useQuery<{
    getBranches: Branch[];
  }>(GET_BRANCHES, { notifyOnNetworkStatusChange: true });

  const { data: deptsData, refetch: deptsRefetch } = useQuery<{
    getDepts: Dept[];
  }>(GET_DEPTS, {
    notifyOnNetworkStatusChange: true,
  });

  const Refetching = useCallback(async () => {
    await branchesRefetch();
    await deptsRefetch();
  }, [branchesRefetch, deptsRefetch]);

  useEffect(() => {
    Refetching();
  }, []);

  const whenComplete = useCallback(
    (data: string) => {
      Refetching();
      setToMutate(null);
      setMutation(null);
      setToUpdate(null);
      setName(null);
      setSelectingBranch(null);
      toast(data);
    },
    [
      Refetching,
      setToMutate,
      setMutation,
      setName,
      setSelectingBranch,
      toast,
      setToUpdate,
    ],
  );

  const [createNewBranch] = useMutationFactory(
    ADD_BRANCH,
    "createNewBranch",
    whenComplete,
  );
  const [updateBranch] = useMutationFactory(
    UPDATE_BRANCH,
    "updateBranch",
    whenComplete,
  );
  const [deleteBranch] = useMutationFactory(
    DELETE_BRANCH,
    "deleteBranch",
    whenComplete,
  );
  const [createNewDepartment] = useMutationFactory(
    CREATE_DEPT,
    "createNewDepartment",
    whenComplete,
  );
  const [updateDepartment] = useMutationFactory(
    UPDATE_DEPT,
    "updateDepartment",
    whenComplete,
  );
  const [deleteDepartment] = useMutationFactory(
    DELETE_DEPT,
    "deleteDepartment",
    whenComplete,
  );

  const mutateTo = {
    BRANCH: {
      ADD: async () => {
        await createNewBranch({ variables: { name: name } });
      },
      UPDATE: async () => {
        await updateBranch({
          variables: { input: { _id: toUpdate?._id, name: name } },
        });
      },
    },
    DEPARTMENT: {
      ADD: async () => {
        await createNewDepartment({
          variables: { input: { name: name, branch: selectingBranch } },
        });
      },
      UPDATE: async () => {
        await updateDepartment({
          variables: {
            input: {
              _id: toUpdate?._id,
              name: name,
              branch: selectingBranch,
            },
          },
        });
      },
    },
  };

  const Submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mutation && toMutate) {
        await mutateTo[toMutate][mutation]();
      }
    },
    [mutateTo, mutation, toMutate],
  );

  const forDeletion = useCallback(async () => {
    const deleteFunc = {
      BRANCH: async () =>
        await deleteBranch({ variables: { id: toUpdate?._id } }),
      DEPARTMENT: async () => {
        await deleteDepartment({ variables: { _id: toUpdate?._id } });
      },
    };
    if (toMutate) {
      await deleteFunc[toMutate]();
    }
  }, [deleteBranch, toMutate, deleteDepartment, toUpdate]);

  return (
    <>
      {toUpdate && !mutation && toMutate && (
        <Confirmation
          color="red"
          message={`Do you want to delete ${toUpdate.name} ${toMutate}?`}
          yes={forDeletion}
          no={() => setToUpdate(null)}
        />
      )}

      {mutation && toMutate && (
        <form
          className="w-full h-full items-center justify-center absolute top-0 left-0 bg-white/10 backdrop-blur-xs z-100 flex"
          onSubmit={Submit}
        >
          <div
            className="absolute w-full h-full top-0 left-0 z-80"
            onClick={() => {
              setToMutate(null);
              setMutation(null);
              setToUpdate(null);
              setName(null);
              setSelectingBranch(null);
            }}
          ></div>
          <div className="flex flex-col shadow-lg shadow-black/30 z-90 w-1/4 h-1/3 border-2 border-blue-800 rounded-md overflow-hidden bg-white">
            <div className="p-2 font-black uppercase text-white bg-blue-500 text-center border-b-2 border-blue-800">
              {mutation} {toMutate}{" "}
            </div>
            <div className="w-full bg-blue-100 gap-2 h-full p-5 flex items-center justify-center flex-col">
              <label className="w-full">
                <div>Name:</div>
                <input
                  type="text"
                  id="name"
                  autoComplete="off"
                  name="name"
                  value={name ?? ""}
                  onChange={(e) => {
                    const value =
                      e.target.value.trim() === "" ? null : e.target.value;
                    setName(value);
                  }}
                  className="w-full outline-none bg-white shadow-md rounded-sm border px-2 p-1"
                />
              </label>
              {toMutate === "DEPARTMENT" && (
                <label className="w-full">
                  <div className="">Branch:</div>
                  <select
                    name="selectBranch"
                    id="selectBranch"
                    onChange={(e) => {
                      const value =
                        e.target.value.trim() === "" ? null : e.target.value;
                      setSelectingBranch(value);
                    }}
                    className="w-full border px-2 p-1 bg-white rounded-sm shadow-md outline-none"
                    value={selectingBranch ?? ""}
                  >
                    <option value="">Select Branch</option>
                    {branchesData?.getBranches.map((branch) => {
                      return (
                        <option value={branch._id} key={branch._id}>
                          {branch.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}
              <div className="flex gap-2 w-full">
                <button
                  className="bg-green-600 hover:bg-green-700 border-2 border-green-800 rounded-md py-2 font-black uppercase text-white cursor-pointer transition-all w-full"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="w-full h-full bg-gray-100 overflow-hidden flex flex-col p-4">
        <div className="text-2xl font-black uppercase">Dept & Branch</div>
        <div className="w-full h-full mt-2 flex gap-2 overflow-hidden">
          <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="bg-blue-500 items-center border-2 border-blue-800 px-3 py-2 font-black uppercase text-white rounded-t-md flex justify-between">
              <p className="">Branch</p>
              <button
                onClick={() => {
                  setMutation("ADD");
                  setToMutate("BRANCH");
                }}
                className="cursor-pointer bg-green-600 hover:bg-green-700 transition-all text-xs px-3 border-2 border-green-800 rounded-sm uppercase py-1"
              >
                create
              </button>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-auto">
              {branchesData?.getBranches.map((branch) => {
                return (
                  <div
                    key={branch._id}
                    className="flex border-x-2 px-4 hover:bg-blue-300 transition-all last:border-b-2 last:rounded-b-md last:shadow-md even:bg-blue-100 items-center odd:bg-blue-200 border-blue-800 justify-between"
                  >
                    <div className="font-semibold">{branch.name}</div>
                    <div className="flex gap-2 py-2">
                      <button
                        onClick={() => {
                          setMutation("UPDATE");
                          setToMutate("BRANCH");
                          setToUpdate(branch);
                          setName(branch.name);
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
                          setToUpdate(branch);
                          setToMutate("BRANCH");
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
          <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="bg-blue-500 items-center border-2 border-blue-800 px-3 py-2 font-black uppercase text-white rounded-t-md flex justify-between sticky top-0">
              <p>Department</p>
              <button
                onClick={() => {
                  setMutation("ADD");
                  setToMutate("DEPARTMENT");
                }}
                className="cursor-pointer bg-green-600 hover:bg-green-700 transition-all text-xs px-3 border-2 border-green-800 rounded-sm uppercase py-1"
              >
                create
              </button>
            </div>
            <div className="w-full h-full flex flex-col overflow-y-auto">
              {deptsData?.getDepts.map((dept) => {
                return (
                  <div
                    key={dept?._id}
                    className="flex border-x-2 px-4 hover:bg-blue-300 transition-all last:border-b-2 last:rounded-b-md last:shadow-md even:bg-blue-100 items-center odd:bg-blue-200 border-blue-800 justify-between"
                  >
                    <div className="font-semibold">
                      {dept?.name} - {dept?.branch?.name}
                    </div>
                    <div className="flex gap-2 py-2">
                      <button
                        onClick={() => {
                          setMutation("UPDATE");
                          setToMutate("DEPARTMENT");
                          setToUpdate(dept);
                          setName(dept.name);
                          setSelectingBranch(dept.branch._id);
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
                          setToUpdate(dept);
                          setToMutate("DEPARTMENT");
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
      </div>
    </>
  );
};

export default DeptAndBranchPage;
