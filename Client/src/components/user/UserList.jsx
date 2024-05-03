//Usamos esta clsae para abstraer la lista
/* eslint-disable react/prop-types */
import useAuth from "../../hooks/useAuth"
import avatar from "../../assets/img/user.png"
import Global from "../../helpers/Global"
import { Link } from "react-router-dom"
import ReactTimeAgo from 'react-time-ago'

// eslint-disable-next-line react/prop-types, no-unused-vars
export const UserList = ({ users, getUsers, following, setFollowing }) => {
    const { auth } = useAuth()

    const follow = async (userId) => {
        //peticion al backend para guarda el follow
        const request = await fetch(Global.url + 'follow/save', {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await request.json()
        //cuando este ok
        if (data.status == "success") {
            //actualizar estado de following, agregando el nuevo follow
            setFollowing([...following, userId])
        }

    }

    const unfollow = async (userId) => {

        //peticion al backend para borrar el follow
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        //cuando este ok
        const data = await request.json()
        //actualizar estado de following, agregando el nuevo follow, filtrando
        if (data.status == "success") {
            let filterFollowings = following.filter(followingUserId => userId !== followingUserId)
            setFollowing(filterFollowings)
        }
        //datos para eliminar el antigup userId que
        //acabo de dejar de seguir
    }

    return (
        <>

            <div className="content__posts">


                {users.map(user => {
                    return (
                        <article className="posts__post" key={user.id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + user._id}className="post__image-link">
                                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}

                                    </Link>
                                </div>
                                <div className="post__body">
                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/" + user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/perfil/" + user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale="es-Es"/></Link>
                                    </div>
                                    <h4 className="post__content">{user.bio}</h4>
                                </div>
                            </div>
                            {user._id != auth._id &&
                                <div className="post__buttons">
                                    {!following.includes(user._id) &&
                                        <a href="#" className="post__button post__button--green"
                                            onClick={() => follow(user._id)}>
                                            Seguir
                                        </a>
                                    }
                                    {following.includes(user._id) &&
                                        <a href="#" className="post__button post__button"
                                            onClick={() => unfollow(user._id)}>
                                            Dejar se seguir
                                        </a>
                                    }
                                </div>
                            }

                        </article>
                    )
                })}


            </div>


        </>
    )
}
