'use client'
import React, { useEffect } from 'react'
import { signInWithGoogle, signOut, onAuthStateChanged } from "../utils/auth";
import {User} from 'firebase/auth';
import { useUserContext } from '../MyContext';

const Navbar = ({ showOthers, setShowOthers }: { showOthers: boolean, setShowOthers: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const menuItems = [
    { href: "", label: ""}
    // { href: "/", label: "Home" },
    // { href: "/musicGenres", label: "Music Genres" },
    // { href: "/test", label: "Test" },
  ]
  const { user, setUser } = useUserContext();
  // const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"))
    }

    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        console.log("user", user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        console.log("no user", user);
        setUser(null);
        localStorage.removeItem("user");
      }
    })

    return () => unsubscribe();
  }, [])
  
  return (
    <div
        className="fixed w-full h-10 flex justify-center"
      >
        <div
          className="max-w-7xl h-10 flex grow justify-between items-center"
        >
          {/* <div
            className='flex items-center gap-4'
          >
            Show others:
            <input 
              type="checkbox"
              className='toggle'
              defaultChecked={showOthers}
              onChange={() => setShowOthers(!showOthers)}
            />
          </div> */}
          <div
            className="flex gap-4"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white hover:text-slate-400"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div

          >
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-white hover:text-red-600"
              >
                Sign Out
              </button>
            ) : (<button
              onClick={signInWithGoogle}
              className="text-white hover:text-red-600"
            >
              Sign In
            </button>
            )}
          </div>
        </div>
      </div>
  )
}

export default Navbar