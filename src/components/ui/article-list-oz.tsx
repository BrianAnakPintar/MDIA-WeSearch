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
              title: "ImageNet: A large-scale hierarchical image database",
              author: {
                name: "Fei-Fei Li",
                avatar: "https://hai.stanford.edu/sites/default/files/styles/person_big/public/2020-03/hai_1512feifei.png?itok=hnMXbYEE",
              },
              description: "The ImageNet paper introduced a large-scale dataset of over 14 million labeled images organized by the WordNet hierarchy. It enabled the ImageNet ...",
              tags: ["ML/AI", "Science", "Technology"],
              imageSrc: "https://production-media.paperswithcode.com/datasets/ImageNet-0000000008-f2e87edd_Y0fT5zg.jpg",
              pdfFile: "ImageNet.pdf"
            },
            {
              postId: 2,
              title: "Polynomial invariants of GL2: Conjugation over finite fields",
              author: {
                name: "Aryaman Maithani",
                avatar: "https://media.licdn.com/dms/image/v2/C5103AQHzBVF3Pa8G1Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1538303692215?e=2147483647&v=beta&t=7k6eRZX4dFErswEcyTMNkH_JLGnaS4wqguYHrsiVRWU",
              },
              description: "Consider the conjugation action of GL2(K) on the polynomial ring ...",
              tags: ["Math", "Science", "Geometry"],
              imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBrOMwEmT5kBrPsCvanJ5WiMwbL0AVrre2A&s",
              pdfFile: "polyInvariants.pdf"
            },
            {
              postId: 3,
              title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
              author: {
                name: "DeepSeek-AI",
                avatar: "https://img.cryptorank.io/coins/deep_seek1737979405027.png",
              },
              description: "We introduce our first-generation reasoning models, DeepSeek-R1-Zero and DeepSeek-R1. DeepSeek-R1-...",
              tags: ["LLM", "NLP", "Reinforcement Learning"],
              imageSrc: "https://miro.medium.com/v2/resize:fit:1400/0*dJ987DROJ9paRqOK.jpg",
              pdfFile: "src"
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
    return <div className="loading-screen"><Spinner></Spinner></div>;
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
