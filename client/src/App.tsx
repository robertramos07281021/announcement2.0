import React, { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./pages/Routes/AdminRoute.tsx";
import UserRoute from "./pages/Routes/UserRouter.tsx";

const LoginPage = lazy(() => import("./pages/Login.tsx"));
const TVMonitorPage = lazy(() => import("./pages/TVMonitor.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminPages/LandingPage.tsx"));
const AccountsPage = lazy(() => import("./pages/AdminPages/AccountsPage.tsx"));
const DeptAndBranchPage = lazy(
  () => import("./pages/AdminPages/DeptAndBranchPage.tsx"),
);
const UploaderPage = lazy(() => import("./pages/AdminPages/UploaderPage.tsx"));

type LoadableProps = {
  children?: ReactNode;
};

const Loadable =
  (Component: React.LazyExoticComponent<React.FC<any>>) =>
  (props: LoadableProps) => (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center z-200 ">
          <div className="w-50 h-50 flex items-center justify-center relative">
            <div className="w-full h-full border-b-8 shadow-md shadow-black border-slate-600 rounded-full trasition-all animate-spin"></div>
            <div className="absolute text-slate-600 text-2xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );

const LazyHomePage = Loadable(LoginPage);
const LazyTVMonitor = Loadable(TVMonitorPage);
const LazyAdminDashboardPage = Loadable(AdminDashboard);
const LazyAccountsPage = Loadable(AccountsPage);
const LazyDeptAndBranchPage = Loadable(DeptAndBranchPage);
const LazyUploaderPage = Loadable(UploaderPage);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LazyHomePage />} />
        {/* <Route path="/tv-monitor" element={<LazyTVMonitor />} /> */}
        <Route
          path="/tv-monitor"
          element={
            <React.Suspense fallback={<div>Loading TV Monitor...</div>}>
              <LazyTVMonitor />
            </React.Suspense>
          }
        />
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<LazyAdminDashboardPage />} />
          <Route path="/accounts" element={<LazyAccountsPage />} />
          <Route path="/dept-branch" element={<LazyDeptAndBranchPage />} />
          <Route path="/config-upload" element={<LazyUploaderPage />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="/config-upload-user" element={<LazyUploaderPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
