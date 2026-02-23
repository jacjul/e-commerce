import {useQuery} from "@tanstack/react-query"
import {getAPI, postAPI} from "../apiCalls"

const Profile = () => {

  // nur testendpunkt -> kann weg 
  const {data:test,isError,isLoading} = useQuery({
    queryKey : ["hello"],
    queryFn : async()=>{
      const response = await getAPI("/api/hello")
      console.log(response)
      return response
    }
    

  })

  if (isLoading){return (<div>...is loading</div>)}
  if (isError){return (<div>...is error</div>)}

  return (
    <div className="p-6">Profile</div>
  )
}

export default Profile