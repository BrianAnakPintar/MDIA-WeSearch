import "./App.css";
import ArticleCard from "./components/ui/article-card";
import { Badge, Button, For } from "@chakra-ui/react";
import Navbar from "./components/ui/navbar";
import { VscHome } from "react-icons/vsc";
import { AiOutlineUpload } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { Link } from "react-router-dom";
import ArticleListOz from "./components/ui/article-list-oz";

function App() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="sidebar">
          <Link to="/">
            <Button className="nav-button selected-sideitem">
              <VscHome /> Home
            </Button>
          </Link>
          <Link to="/upload">
            <Button className="nav-button">
              <AiOutlineUpload /> Upload
            </Button>
          </Link>
          <Button className="nav-button">
            <CiBookmark /> Bookmarks
          </Button>
          <Button className="nav-button">My Contribution</Button>
        </div>
        <div className="main-homepage">
          <ArticleListOz />
        </div>
      </div>
    </>
  );
}

export default App;
