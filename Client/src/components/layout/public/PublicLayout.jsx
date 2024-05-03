
import useAuth from "../../../hooks/useAuth"
import Header from "./Header"
import { Navigate, Outlet } from "react-router-dom"

export const PublicLayout = () => {
  const {auth} = useAuth()
  return (
    <>
      <Header />
      <section className="layout__content">
        
        {!auth._id ?
        
        <Outlet />
        : 
        <Navigate to="/social"/>
        }
      </section>
    </>
  )
}
//Usamos el ternario para evitar que si un usuario ya está logeado vaya a las paginas de registro o login
