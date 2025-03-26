import "@/App.css";
import { VscHome } from "react-icons/vsc";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { AiOutlineUpload } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import { Button, Text } from "@chakra-ui/react";
import ArticleListOz from "@/components/ui/article-list-oz";
import HeroCarousel from "@/components/ui/hero-carousel";

function Home() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="sidebar">
          <Link to="/home">
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
          <div className="featured">
            <Text textStyle="xl" fontWeight="bold">
              New Releases
            </Text>
            <HeroCarousel />
          </div>
          <div className="article-lists">
            <Text textStyle="xl" fontWeight="bold">
              Discover Trending Research Articles
            </Text>
            <ArticleListOz />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
