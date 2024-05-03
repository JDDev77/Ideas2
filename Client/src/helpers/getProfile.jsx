import Global from "./Global"

const getProfile = async(userId, setState) =>{
    const request = await fetch(Global.url + "user/profile/" + userId,{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization" : localStorage.getItem("token")
        }
    })

    const data = await request.json()
    if(data.status == "success"){
        setState(data.user)
    }
    return data
   
}

export default getProfile