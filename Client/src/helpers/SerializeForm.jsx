

export const SerializeForm = (form) => {
     // Devolvemos el objeto para uso adicional si es necesario
     const formData = new FormData(form)
     const completeObj = {}
    
     for(let [name,value] of formData){
        completeObj[name] = value
     }

     return completeObj
}
