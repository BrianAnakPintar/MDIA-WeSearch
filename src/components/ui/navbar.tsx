import { Avatar } from "@/components/ui/avatar";
import { Button, Input } from "@chakra-ui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { SlMagnifier } from "react-icons/sl";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/home">
        <Button className="invis-btn" fontSize={"1.25rem"}>
          wesearch.ai <SlMagnifier />
        </Button>
      </Link>
      <div className="searchbar">
        <Input
          placeholder="Search by keywords"
          borderRadius="1rem"
          color="black"
          variant="subtle"
        />
      </div>
      <div className="nav-info">
        <Link to="/">
          <Button className="invis-btn">
            <CiSettings />
          </Button>
        </Link>
        <Button className="invis-btn">
          <IoMdNotificationsOutline />
        </Button>
        <Button className="invis-btn">
          <Avatar />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
