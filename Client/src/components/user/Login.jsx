import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
    const { form, changed } = useForm({});
    const [status, setStatus] = useState({
        saved: false,
        message: ''
    });
    const {setAuth} = useAuth()
    
    const loginUser = async (e) => {
        e.preventDefault();
        console.log(form); // Datos de formulario
        let userToLogin = form;

        try {
            const request = await fetch(`${Global.url}user/login`, {
                method: "POST",
                body: JSON.stringify(userToLogin),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await request.json();
            console.log(data); // Persistir los datos en el navegador

            if (data.status === 'success') {
                setStatus({
                    saved: true,
                    message: 'Usuario logueado correctamente'
                });
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                // Aquí podrías también realizar otras acciones como guardar el token en localStorage
                // Setear en el auth
                setAuth(data.user)

                //Redireccion, tarda 2 segundos para que le de tiempo al usuario que vea que va todo
                //bien
                setTimeout(() => {
                  window.location.reload()
                },1000)
            } else {
                setStatus({
                    saved: false,
                    message: data.message || 'Error al intentar loguearse'
                });
            }
        } catch (error) {
            setStatus({
                saved: false,
                message: 'Error de conexión con el servidor'
            });
        }
    };

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                <strong className={`alert ${status.saved ? 'alert-success' : 'alert-danger'}`}>
                    {status.message}
                </strong>
                <form className="form-login" onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" onChange={changed}/>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" onChange={changed}/>
                    </div>
                    <input type="submit" value="Identifícate" className="btn btn-success"/>
                </form>
            </div>
        </>
    );
}
