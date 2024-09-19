import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from './_auth/Forms/SignupForm'
import SigninForm from './_auth/Forms/SigninForm'
import { Toaster } from "./components/ui/toaster";
import "./global.css";
import Home from "./_root/Pages/Home";
import Explore from "./_root/Pages/Explore";
import Saved from "./_root/Pages/Saved";
import CreatePost from "./_root/Pages/CreatePost";
import EditPost from "./_root/Pages/EditPost";
import PostDetails from "./_root/Pages/PostDetails";
import Profile from "./_root/Pages/Profile";
import UpdateProfile from "./_root/Pages/UpdateProfile";
import AllUsers from "./_root/Pages/AllUsers";

function App(){ 
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers/>} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}

export default App