import { useMutation } from "@apollo/client/react";
import type { Success } from "./types.ts";
import { toast } from "react-toastify";

const useMutationFactory = <TData extends Record<string, Success>>(
  mutation: any,
  key: keyof TData,
  complete: (value: string) => void,
) => {
  return useMutation<TData>(mutation, {
    onCompleted: (data) => {
      complete(data[key].message);
    },
    onError: (err) => {
      toast(err.message);
    },
  });
};

export default useMutationFactory;
