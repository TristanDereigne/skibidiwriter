import {useEffect, useState} from "react";
import {useUserContext} from "@/context/UserContext.tsx";

export const ProfileRounded = ({width, height, textSize}:{width: number, height: number, textSize: number}) => {

    const user = useUserContext()

    const [userFirstLetter, setUserFirstLetter] = useState<string | null>("")

    useEffect(()=>{

        if(user.username) {
            let userFirstLetter = user.username[0].toUpperCase()
            setUserFirstLetter(userFirstLetter)
        }

    }, [user.username])

    return(
        <button style={{ width: `${width}px`, height: `${height}px` }} className={"cursor-pointer rounded-full flex justify-center items-center bg-[#432DD7]"}>
            <p style={{ fontSize:`${textSize}px`}} className={"text-white"}>{userFirstLetter}</p>
        </button>
    )
}