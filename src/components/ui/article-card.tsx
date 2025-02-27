import { Button, Card, Image } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import React from "react";

// Define the interface for the author object
interface Author {
  name: string;
  avatar: string;
}

// Define the interface for the ArticleCard props
interface ArticleCardProps {
  title: string;
  author: Author;
  description: string;
  tags: string[];
  imageSrc: string;
  postId: number | string;
}

function ArticleCard({ title, author, description, tags, imageSrc, postId }: ArticleCardProps) {
  return (
    <Link to={`/post/${postId}`} className="article-card">
      <Card.Root variant="elevated" flexDirection="row" maxW="sm" borderRadius="4xl">
        <Card.Body gap="2">
          <div className="card-user">
            <Avatar src={author.avatar} name="Profile" size="lg" />
            <h3>{author.name}</h3>
          </div>
          <div className="card-info">
            <Card.Title fontSize="md" lineHeight="short" mt="2">{title}</Card.Title>
            <Card.Description fontSize="xs">{description}</Card.Description>
            <div className="card-tags">
              {tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </div>
          </div>
        </Card.Body>
        <div className="card-img-container">
          <Image
            className="card-img"
            src={imageSrc}
            alt={title}
            align="center"
          />
        </div>
      </Card.Root>
    </Link>
  );
}

export default ArticleCard;