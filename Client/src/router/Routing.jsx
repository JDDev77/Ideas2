//import React from "react"
import { Routes, Route, BrowserRouter,Link} from "react-router-dom"
import { PublicLayout } from "../components/layout/public/PublicLayout.jsx"
import { PrivateLayout } from "../components/layout/private/PrivateLayout.jsx"
import { Login } from "../components/user/Login"
import { Register } from "../components/user/Register"
import { Feed } from "../components/publication/feed.jsx"
import { AuthProvider } from "../context/AuthProvider.jsx"
import {Logout} from "../components/user/Logout.jsx"
import { People } from "../components/user/People.jsx"
import { Config } from "../components/user/Config.jsx"
import { Ayuda } from "../components/layout/public/Ayuda.jsx"
import { Following } from "../components/follows/Following.jsx"
import { Profile } from "../components/user/Profile.jsx"
import { Followers } from "../components/follows/Followers.jsx"
import { UserList } from "../components/layout/back_office/UserList.jsx"
import { UserForm } from "../components/layout/back_office/UserForm.jsx"
import { UserUpdate } from "../components/layout/back_office/UserUpdate.jsx"
import { UserDetail } from "../components/layout/back_office/UserDetail.jsx"

//TODO IMPLEMENTAR VISTAR ERROR 404
export const Routing = () => {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="ayuda" element={<Ayuda />} />
        </Route>

        <Route path="/social" element={<PrivateLayout/>}>
            <Route index element= {<Feed />} />
            <Route path="feed" element=  {<Feed />} />
            <Route path="logout" element= {<Logout />}/>
            <Route path="gente" element= {<People />}/>
            <Route path="ajustes" element= {<Config />}/>
            <Route path="siguiendo/:userId" element={<Following/>}/>
            <Route path="seguidores/:userId" element={<Followers/>}/>
            <Route path="perfil/:userId" element={<Profile/>}/>
            
            <Route path="usuarios" element={<UserList/>} />
            <Route path="usuarios/nuevo" element={<UserForm />} />
            <Route path="usuarios/editar/:id" element={<UserUpdate />} />
            <Route path="usuarios/detalle/:id" element={<UserDetail />} />
            
        </Route>
  
        <Route path="*" element={
          <>
          <p>
          <h1>Error 404 </h1>
          <Link to ="/">Volver al inicio</Link>
          </p>
          </>
        }/>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
