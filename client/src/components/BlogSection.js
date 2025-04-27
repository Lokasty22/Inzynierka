import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/admin/articles/latest");
        setArticles(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania artykułów:", error);
      }
    };
    fetchArticles();
  }, []);

  // Funkcja do skracania tekstu i usuwania znaczników HTML
  const truncateText = (text, maxLength) => {
    // Usuń znaczniki HTML
    const plainText = text.replace(/<[^>]+>/g, "");
    // Skróć tekst do maxLength znaków
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength) + "...";
    }
    return plainText;
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-start">Blog korepetycje</h2>
      <div className="row">
        {articles.map((article) => (
          <div className="col-md-4" key={article._id}>
            <div className="card mb-4 shadow-sm">
              <div className="blog-card-img-container">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    className="blog-card-img"
                    alt={article.title}
                  />
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  {truncateText(article.title, 50)}
                </h5>
                <p className="card-text">
                  {truncateText(
                    article.excerpt || article.content,
                    100, // Maksymalna liczba znaków dla wstępu
                  )}
                </p>
                <Link
                  to={`/artykul/${article._id}`}
                  className="btn btn-primary"
                >
                  Czytaj więcej
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
