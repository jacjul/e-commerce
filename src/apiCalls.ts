export  async function getAPI(url="/api" ,accessToken?:string|null){
    try{ 
    const response = await fetch(url , {
        method : "GET" ,
        headers : {"Content-type" : "application/json",
            ...(accessToken? {Authorization :`Bearer ${accessToken}`}:{}),
        },
        credentials: "include",
        mode: "cors" 
    })

    if (!response.ok){
        throw new Error (`Response status ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return {"message": data, "success": true}}
    catch(err){return {"message": `Following error occured ${err}`, "success":false}}

}

export async function postAPI(url="/api",accessToken?:string|null, body={}){
    try {
    const response = await fetch (url, {
        method :"POST",
        headers:{"Content-Type": "application/json",
            ...(accessToken? {Authorization :`Bearer ${accessToken}`}:{}),
        },
        body : JSON.stringify(body),
        mode : "cors"
    })
    if(!response.ok){
        throw new Error(`Response status ${response.status}`)}

    const data = await response.json()
    console.log(data)
    return({"message":data, "success":true})

    }catch(err){
        return({"message":`Following error occured ${err}`, "success":false})
    }
}