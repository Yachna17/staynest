import logo from "../../assets/StayNestLogo.png"

export default function Footer (){
    return(
        <footer className="grid grid-cols-3 items-center px-10 mt-20">
        <img src={logo} alt="StayNestLogo" className="h-15 w-15 "  ></img>
        <p className="justify-self-center" >&copy; 2026 All rights reserved</p>
        <p className="justify-self-end" >Links</p>
        </footer>
    )
}