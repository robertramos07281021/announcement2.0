import { useSelector } from 'react-redux'
import Wrapper from '../Wrapper.tsx'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../../redux/store.ts'
import Navbar from '../../components/Navbar.tsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRoute = () => {
  const {userLogged} = useSelector((state:RootState)=> state.auth )
  return userLogged && userLogged.type === "ADMIN" ? (
    <Wrapper>
      <ToastContainer />
      <Navbar/>
      <Outlet/>
    </Wrapper>
  ) : <Navigate to="/"/>
}

export default AdminRoute
