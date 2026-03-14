import {useQuery} from "@tanstack/react-query"
import {getAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"

type ProfileData = {
  id: number
  name: string
  lastname: string
  username: string
  role: "admin" | "user" | string
  created_at?: string
}

const Profile = () => {
  const {accessToken,logout} = useAuth()
  
  const {data:profile,isError,isLoading,error} = useQuery<ProfileData>({
    queryKey : ["me"],
    queryFn : async()=>{
      const response = await getAPI("/api/user/me", accessToken)
      return response.message
    }
  })

  if (isLoading){
    return (
      <div className="p-6">
        <div className="card-shell mx-auto max-w-2xl">
          <div className="card-content text-slate-300">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (isError || !profile){
    return (
      <div className="p-6">
        <div className="card-shell mx-auto max-w-2xl">
          <div className="card-content text-rose-200">Could not load profile: {error?.message}</div>
        </div>
      </div>
    )
  }

  const initials = `${profile.name?.[0] ?? ""}${profile.lastname?.[0] ?? ""}`.toUpperCase()
  const joined = profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"

  return (
    <div className="p-6 md:p-8">
      <div className="card-shell mx-auto max-w-2xl">
        <div className="card-content gap-5">
          <div className="section-separator flex items-center justify-between">
            <div>
              <h2 className="mb-1">Profile</h2>
              <p className="value-text text-slate-300">Your account overview</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-500/10 font-semibold text-cyan-200">
              {initials || "U"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
              <div className="header-row">Name</div>
              <div className="label-primary">{profile.name} {profile.lastname}</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
              <div className="header-row">Username</div>
              <div className="label-primary">@{profile.username}</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
              <div className="header-row">Role</div>
              <div className="value-text text-slate-200 uppercase tracking-wide">{profile.role}</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
              <div className="header-row">Joined</div>
              <div className="value-text text-slate-200">{joined}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="control-base border-rose-500/60 bg-rose-700/30 hover:bg-rose-600/40" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile