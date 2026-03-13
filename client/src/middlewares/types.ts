import type { User } from "../redux/slices/authSlice.ts";

export type Dept = {
  _id: string;
  name: string;
  branch: Branch;
};

export type Branch = {
  _id: string;
  name: string;
};
export type Success = {
  message: string;
  success: boolean;
  user: User;
  announcement: string;
};

export type ForSideMain = {
  mute: boolean;
  type: string;
  value: string;
};

export type TVMonitors = {
  _id: string;
  department: Dept;
  main: ForSideMain;
  side: ForSideMain;
};
