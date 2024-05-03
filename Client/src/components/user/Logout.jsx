import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

export const Logout = () => {
  const {setAuth, setCounters} = useAuth()
   const navigate = useNavigate()
  useEffect(() => {
    
    //Vacia el localStorage
    localStorage.clear()
    //Setea los estados globales a vacio
    setAuth({})
    setCounters({})
    //Redirige al login
    navigate("/login")
  })
  return (
    <h1>Cerrando sesión . . .</h1>
  )
}
