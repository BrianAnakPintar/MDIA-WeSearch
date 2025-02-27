import './App.css'
import ArticleCard from './components/ui/article-card'
import { Badge, Button, For } from '@chakra-ui/react'
import Navbar from './components/ui/navbar'
import { VscHome } from "react-icons/vsc";
import { AiOutlineUpload } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { Link } from 'react-router-dom';
import ArticleListOz from './components/ui/article-list-oz';

function App() {

  const Tags = ["All", "Science", "Technology", "Engineering", "Mathematics", "Medicine & Health", "Arts & Humanities", "Environment", "Business"]

  const articleData = {
    title: "ImageNet: A Large-Scale Hierarchical Image Database",
    author: {
      name: "Author Name",
      avatar: "https://picsum.photos/200/300",
    },
    description: "The ImageNet paper introduced a large-scale dataset of over 14 million...",
    tags: ["Machine Learning", "Computer Vision", "Datasets"],
    imageSrc: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
    postId: 1, // Can also be a string, e.g., "1"
  };

  return (
    <>
      <Navbar/>
      <div className="wrapper">
        <div className="sidebar">
          <Link to='/'><Button className='nav-button selected-sideitem'><VscHome/> Home</Button></Link>
          <Link to='/upload'><Button className='nav-button'><AiOutlineUpload/> Upload</Button></Link>
          <Button className='nav-button'><CiBookmark/> Bookmarks</Button>
          <Button className='nav-button'>My Contribution</Button>
        </div>
        <div className="main-homepage">
          {/* Tags */}
          <div className="tags">
            <For each={Tags}>
              {(item, index) => 
              <Badge className='article-tag' 
                     variant={item=="All"? 'solid' : 'outline'}
                     size="lg">{item}</Badge>}
            </For>
          </div>
          <ArticleListOz/>
        </div>
        </div>
    </>
  )
}

export default App
