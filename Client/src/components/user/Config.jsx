import { useState } from "react"
import useAuth from "../../hooks/useAuth"
import { SerializeForm } from "../../helpers/SerializeForm"
import { Global } from "../../helpers/Global"

export const Config = () => {
   
    const [saved,setSaved] = useState("not_saved")
    const {auth,setAuth} = useAuth()
    const updateUser = async(e) => {
        
        e.preventDefault()
        //Token de autenticacion
        const token = localStorage.getItem("token")
        //Recoger datos de formulario
        let newDataUser = SerializeForm(e.target)
        //Borrar propiedad innceseario
        delete newDataUser.file0
        //Actualizar usuario
        const request = await fetch(Global.url + "user/update",{
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const data = await request.json()

        if(data.status == "succes"){
            delete data.user.password
            setAuth(data.user)
            setSaved("saved")
            console.log(auth)
        }else{
            setSaved("error")
        }

        //Subida de imagenes
        const fileInput = document.querySelector("#file")

        if(data.status == "success" && fileInput.files[0]){

            //Recoger imagen a subir
            const formData = new FormData()
            formData.append('file0', fileInput.files[0])
            //Peticion para enviar el fichero
            const uploadRequest = await fetch(Global.url + "user/upload",{
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            })
            const uploadData = await uploadRequest.json()
            console.log(uploadData)

            if(uploadData.status == "success"){
                delete uploadData.password
                setAuth(uploadData.user)
                setSaved("saved")
            }else{
                setSaved("error")
            }
            
        }
    }
//TODO comprobar la condicional de succes y alert ya que estan invertidas
  return (
    <>
     <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>
            <h1></h1>
            <div className="content__posts">
                {saved == "saved" ?
                <strong className="alert alert-success"> Usuario no actualizado correctamente</strong> : ''
                }
                {saved == "error" ?
                <strong className="alert alert-danger"> Usuario actualizado correctamente</strong> : ''
                }
                <form className="config-form" onSubmit={updateUser}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" defaultValue={auth.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name="surname" defaultValue={auth.surname}/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="surname">Mote</label>
                        <input type="text" name="nick"defaultValue={auth.nick} />
                    </div>
                    <div className="form-group">
                    <label htmlFor="bio">Biografia</label>
                        <textarea name="bio" defaultValue={auth.bio}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name="email"  defaultValue={auth.email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file0">Avatar</label>
                        <div className="avatar" defaultValue={auth.name}>
                            
                        </div>
                    <input type="file" name="file0" id="file"/>
                    </div>
                    <br></br>
                    <input type="submit" value="Actualizar" className="btn btn-success" />
                </form>
            </div>
    </>
    
  )
}
