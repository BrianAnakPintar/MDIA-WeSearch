import React, { useState, useEffect } from "react";
import ArticleCard from "./article-card";
import { Spinner } from "@chakra-ui/react";

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
}

function ArticleListOz() {
  const [articles, setArticles] = useState<Article[]>([]); // Use the Article[] type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);

      // Simulate an API call with hardcoded data and a delay
      setTimeout(() => {
        try {
          const data: Article[] = [
            {
              postId: 1,
              title:
                "Mentoring strategies in a project-based learning environment: A focus on self-regulation",
              author: {
                name: "Patrick Pennefather",
                avatar: "",
              },
              description: `This study examines how faculty mentor self-regulatory behaviors in a project-based learning environment within Vancouver’s Master of Digital Media (MDM) Program. Three faculty mentors ...`,
              tags: ["Mentoring"],
              imageSrc:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPRapdvodJRX-DRtvHPNKcJhdMMgAwGzerwg&s",
              pdfFile: "ImageNet.pdf",
            },
          ];

          setArticles(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || "An error occurred while fetching articles.");
        } finally {
          setIsLoading(false);
        }
      }, 500); //
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Spinner></Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="error-screen">Error: {error}</div>;
  }

  return (
    <div className="postContainers">
      {articles.map((article: any) => (
        <ArticleCard
          key={article.postId}
          title={article.title}
          author={article.author}
          description={article.description}
          tags={article.tags}
          imageSrc={article.imageSrc}
          postId={article.postId}
        />
      ))}
    </div>
  );
}

export default ArticleListOz;
