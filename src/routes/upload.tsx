import React from 'react'
import '@/App.css'
import { Badge, For } from '@chakra-ui/react'
import Navbar from '@/components/ui/navbar'
import { VscHome } from "react-icons/vsc";
import { AiOutlineUpload } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { Button, Group } from "@chakra-ui/react"
import { EmptyState } from "@/components/ui/empty-state"
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import DragUpload from '@/components/ui/drag-upload';
import UploadForm from '@/components/ui/upload-form';


const Tags = ["Document Upload", "AI Summary", "Podcast (AI Support)", "Info Visualization (AI Support)"]

const Upload = () => {
  return (
    <>
      <Navbar/>
      <div className="wrapper">
        <div className="sidebar">
          <Link to='/'><Button className='nav-button'><VscHome/> Home</Button></Link>
          <Link to='/upload'><Button className='nav-button selected-sideitem'><AiOutlineUpload/> Upload</Button></Link>
          <Button className='nav-button'><CiBookmark/> Bookmarks</Button>
          <Button className='nav-button'>My Contribution</Button>
        </div>
        <div className="main-upload">
          <div className="tags">
              <For each={Tags}>
                {(item, index) => 
                <Badge className='article-tag' 
                      variant={item=="Document Upload"? 'solid' : 'outline'}
                      size="lg">{item}</Badge>}
              </For>
          </div>
            <div className="upload-info">
              <div className="center-upload">
                <DragUpload/>
                <p className='text-additional'>Only support .pdf and zip files</p>
              </div>
              <div className="info-side">
                  <UploadForm/>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Upload