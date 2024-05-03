import { useEffect, useState } from "react"
import Global from "../../helpers/Global"
import { UserList } from "../user/UserList"
import { useParams } from "react-router-dom"
import getProfile from "../../helpers/getProfile"

//TODO REVISAR CUANDO TENGAMOS SEGUIDORES Y DEMAS
//TODO revisar como hacer que tu propio usuario no aparezca en el listado
export const Followers = () => {

    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(true)
    const [following, setFollowing] = useState([])
    const [userProfile, setUserProfile] = useState({})

    const params = useParams()


    useEffect(() => {
        getUsers(1)
        getProfile(params.userId, setUserProfile)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getUsers = async (nextPage) => {
        //Efecto de carga
        //Sacar userID de la url
        const userId = params.userId
        //Peticion para sacar usuarios
        const request = await fetch(Global.url + 'follow/followers/' +  userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json()
        console.log(data)
        let cleanUsers = []
        //Recorrer y limpiar follows
    
        data.follows.forEach( follow =>{
            cleanUsers = [...cleanUsers,follow.user]
        })
        data.users = cleanUsers
        //Crear un estado para poder listarlos
        if (data.users && data.status == "success") {
            let newUsers = data.users

            if (users.length >= 1) {
                newUsers = [...users, ...data.users]
            }
            console.log(newUsers)

            setUsers(newUsers)
            console.log(users)
            setFollowing(data.user_following)

        }
        // Paginacion
        if (users.length >= data.total) {
            setMore(false)
        }
    }

    const nextPage = () => {
        let next = page + 1
        setPage(next)
        console.log(page)
        getUsers(next)
        console.log(page, users)
        console.log(page, next)
        console.log(following)
    }

    //TODO meter la targeta del mismo usuario en primer lugar 
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Seguidores de {userProfile.name} {userProfile.surname}</h1>
            </header>
            <UserList users={users}
                getUsers={setUsers}
                following={following}
                setFollowing={setFollowing}
                page={page}
                setPage={setPage}
                more={more} />
            <br />
            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más personas
                    </button>
                </div>
            }
        </>
    )
}
