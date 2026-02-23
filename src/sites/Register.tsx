import {useMutation} from "@tanstack/react-query"
import {useState} from "react"
import {postAPI} from "../apiCalls"

type RegisterPayload = {
  name: string
  last_name: string
  username: string
  password: string
}

const Register = () => {

const [showPassword, setShowPassword] =useState(false)

const mutationRegister = useMutation({
  mutationFn: async(user: RegisterPayload)=>{
    const response = await postAPI("/api/user/register" , user)
    console.log(response)
    return response
  },
  onSuccess:(data) =>{
    console.log(data)
  } 
})
function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    const data = event.currentTarget
    const fd = new FormData(data)
    const values = Object.fromEntries(fd.entries()) as Record<string, string>

    if (values.password !== values.passwordConfirm){
      alert("Passwords are not the same")
    }else {
    const regPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if(regPattern.test(String(values.password))){
    const payload: RegisterPayload = {
      name: values.name,
      lastname: values.lastname,
      username: values.username,
      password: values.password,
    }
    console.log(payload)
    mutationRegister.mutate(payload)}
  else{alert ("Password doens't follow the constrains on passwords")}}

}

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center ">
        <div className="flex flex-col border rounded-2xl p-10 md:p-12">
        <h2>Register site</h2>
        <h5 className="mb-6">Here you can register if this is your first visit on this website</h5>
        <form id="registerForm" onSubmit={handleSubmit} className="grid grid-cols-[130px_minmax(0,1fr)] gap-x-3 gap-y-3 items-center">
            <label className="text-sm" htmlFor="name">Name</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="name" name="name" />

            <label className="text-sm" htmlFor="lastname">Lastname</label>
            <input className="w-full border  bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="lastname" name="lastname" />

            <label className="text-sm" htmlFor="username">Username</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="username" name="username" />


            {showPassword ?
            <>
            <label className="text-sm" htmlFor="password">Password</label>
            <input className="w-full border  bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="password" name="password" placeholder="capital,lower case,number-> 8 digits"/>
            <label className="text-sm leading-tight" htmlFor="passwordConfirm" >Password<br />confirmation</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="text" id="passwordConfirm" name="passwordConfirm" />
            </>
            :
            <>
            <label className="text-sm" htmlFor="password">Password</label>
            <input className="w-full border  bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="password" id="password" name="password"  placeholder="capital,lower case,number-> 8 digits"/>
            <label className="text-sm leading-tight" htmlFor="passwordConfirm">Password<br />confirmation</label>
            <input className="w-full border bg-gray-300 rounded-2xl focus:ring-2 px-3 py-1" type="password" id="passwordConfirm" name="passwordConfirm" />
            </>}
            
        </form>
        <button type="button" onClick={()=>setShowPassword(p => !p)}className="text-sm text-blue-400 hover:text-blue-600 ml-80">Show Password </button>

        <button form="registerForm" type="submit" className="mt-2 bg-blue-300 dark:bg-blue-600 rounded-2xl border">Submit </button>

        </div>
    </div>
  )
}

export default Register