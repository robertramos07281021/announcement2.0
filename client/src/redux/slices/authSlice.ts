import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TVMonitors } from "../../middlewares/types.ts";

type Branch = {
  _id: string;
  name: string;
};

type Department = {
  _id: string;
  name: string;
  branch: Branch;
};

export type User = {
  _id: string;
  username: string;
  name: string;
  department: Department;
  token: string;
  type: string;
  onTv: boolean
};

type UserState = {
  userLogged: User | null;
  newsUpdate: [TVMonitors] | []
};

const initialState: UserState = {
  userLogged: null,
  newsUpdate: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<User | null>) => {
      state.userLogged = action.payload;
    },
    setLogout: () => {
      initialState;
    },
    setNewsUpdate: (state, action: PayloadAction<[TVMonitors] | []>) => {
      state.newsUpdate = action.payload
    }
  },
});

export const { setUserLogged, setLogout,setNewsUpdate } = authSlice.actions;
export default authSlice.reducer;
