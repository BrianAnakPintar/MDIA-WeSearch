import "@/App.css";
import Navbar from "@/components/ui/navbar";
import podcast from "@/assets/ppp_podcast.wav";
import { Box, Text } from "@chakra-ui/react";
import "react-h5-audio-player/lib/styles.css";
import { useParams } from "react-router-dom";

import patrick_paper from "@/assets/Pennefather_PhDDissertation_2016.pdf";
import AudioPlayer from "@/components/ui/audio-player";
import ChatBot from "@/components/ui/chat-bot";

// Define types for the data structure
interface Author {
  name: string;
  avatar: string;
}

interface Article {
  postId: number;
  title: string;
  author: Author;
  description: string;
  tags: string[];
  imageSrc: string;
  pdfFile: string;
  summary: string;
}

const data: Article[] = [
  {
    postId: 1,
    title:
      "Mentoring strategies in a project-based learning environment: A focus on self-regulation",
    author: {
      name: "Patrick Pennefather",
      avatar: "",
    },
    description:
      "A large-scale hierarchical image database for training ML models.",
    tags: ["ML/AI", "Science", "Technology"],
    imageSrc:
      "https://production-media.paperswithcode.com/datasets/ImageNet-0000000008-f2e87edd_Y0fT5zg.jpg",
    pdfFile: patrick_paper,
    summary:
      "This study examines how faculty mentor self-regulatory behaviors in a project-based learning environment within Vancouver’s Master of Digital Media (MDM) Program. Three faculty mentors guided student teams in developing game prototypes for industry partners. Pre-research interviews identified self-motivation, ownership, and self-reliance as key industry expectations. Video-recorded mentoring sessions and interviews revealed that faculty used various strategies to foster these traits, aligning with industry needs.",
  },
];

const Post = () => {
  const params = useParams<{ id: string }>();
  const postData =
    data.find((post) => post.postId === parseInt(params.id as string)) ||
    data[0];

  return (
    <Box>
      <Navbar />
      <Box className="main_content">
        {/* Box for the left part of the screen. */}
        <Box className="post_left">
          <ChatBot />
        </Box>
        {/* Box for the middle part of the screen. */}
        <Box className="post_center">
          <Box className="summary_block">
            <Box className="summary_content">
              <Box>
                <Text className="post_title" fontWeight="bold">
                  {postData.title}
                </Text>
                <Text className="post_authors">
                  {postData.author.name} | August 2019
                </Text>
              </Box>
              <Box>
                <Text textStyle="xl" fontWeight="bold">
                  SUMMARY
                </Text>
                <Text>{postData.summary}</Text>
              </Box>
            </Box>
            <Box className="summary_pdf">
              <iframe src={patrick_paper} height="400" width="300" />
            </Box>
          </Box>
          <Box className="podcast_block">
            <Text textStyle="xl" fontWeight="bold" textAlign="center">
              PODCAST
            </Text>
            <Text textAlign="center">
              Listen to AI-generated discussion of this paper
            </Text>
            <AudioPlayer src={podcast} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Post;
