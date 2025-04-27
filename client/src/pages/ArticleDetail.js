import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const { id: articleId } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/admin/articles/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania artykułu:', error);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <p>Ładowanie artykułu...</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="article-title">{article.title}</h1>
      {article.excerpt && (
        <p className="article-excerpt">{article.excerpt}</p>
      )}
      {article.imageUrl && (
        <div className="article-image-container">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="article-detail-img"
          />
        </div>
      )}


      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticleDetail;
