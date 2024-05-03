import { useState,useEffect, createContext } from "react"
import { Global } from "../helpers/Global"

const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {

  const [auth, setAuth] = useState({})
  const [counters, setCounters] = useState({})
  //solo se cargar cuando este todos los sets cargados
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
  authUser()
      },[])
 const authUser = async() => {
      //sacar datos del usuario idendificado del localstorage
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")
      //comprobar si tengo el token y el user
      if(!token || !user){
        setLoading(false)
        return false
      }
      //trnasformar los datos a un objeto a JS
      const userObj = JSON.parse(user)
      const userId = userObj.id
      //Peticion ajax al back que compruebe el token
      //que me duelve todos los datos del ususairo
      const request = await fetch(Global.url + "user/profile/" + userId,{
        method: "GET",
        headers :{
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
      const data = await request.json()
      //Peticion de contadores
      console.log(data)
      const requestCounters = await fetch(Global.url + "user/counters/" + userId,{
        method: "GET",
        headers :{
          "Content-Type": "application/json",
          "Authorization": token
        }
      })
      const dataCounters = await requestCounters.json()
      //Setear el estado de auth
      setAuth(data.user)
      setCounters(dataCounters)
      setLoading(false)
 }
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        counters,
        setCounters,
        loading
      }}
      >
    
    {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;