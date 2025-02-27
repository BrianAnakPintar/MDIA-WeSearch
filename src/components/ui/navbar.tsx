import { Avatar } from "@/components/ui/avatar"
import { Button } from "@chakra-ui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { SiArxiv } from "react-icons/si";

import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
        <Link to='/'><Button className="invis-btn"><SiArxiv/>MAKE RESEARCH GREAT AGAIN.</Button></Link>
        <div className="nav-info">
            <Link to='/'><Button className="invis-btn"><CiSettings/></Button></Link>
            <Button className="invis-btn"><IoMdNotificationsOutline/></Button>
            <Button className="invis-btn"><Avatar/></Button>
        </div>
    </div>
  )
}

export default Navbar