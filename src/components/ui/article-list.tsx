import React, { useState, useEffect } from "react";
import ArticleCard from "./article-card";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("https://example.com/api/articles"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array to run the effect once on component mount

  if (isLoading) {
    return <div className="loading-screen">Loading articles...</div>;
  }

  if (error) {
    return <div className="error-screen">Error: {error}</div>;
  }

  return (
    <div className="article-list">
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

export default ArticleList;
