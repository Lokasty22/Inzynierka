import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Modal, Button, Form, Alert, Table } from 'react-bootstrap';

const AdminArticles = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/articles', {
        headers: { 'x-auth-token': token },
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania artykułów:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const maxTitleLength = 100;
  const maxExcerptLength = 300;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      setErrorMessage('Proszę wypełnić wszystkie wymagane pola.');
      return;
    }

    if (formData.title.length > maxTitleLength) {
      setErrorMessage(`Tytuł nie może przekraczać ${maxTitleLength} znaków.`);
      return;
    }

    if (formData.excerpt.length > maxExcerptLength) {
      setErrorMessage(`Wstęp nie może przekraczać ${maxExcerptLength} znaków.`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post('/api/admin/articles', data, {
        headers: { 'x-auth-token': token },
      });

      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: null,
      });
      setErrorMessage('');
      setSuccessMessage('Artykuł został dodany pomyślnie.');
      fetchArticles();
    } catch (error) {
      console.error('Błąd podczas zapisywania artykułu:', error);
      setErrorMessage('Wystąpił błąd podczas dodawania artykułu.');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: null,
    });
    setErrorMessage('');
    setSuccessMessage('');
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      setErrorMessage('Proszę wypełnić wszystkie wymagane pola.');
      return;
    }

    if (formData.title.length > maxTitleLength) {
      setErrorMessage(`Tytuł nie może przekraczać ${maxTitleLength} znaków.`);
      return;
    }

    if (formData.excerpt.length > maxExcerptLength) {
      setErrorMessage(`Wstęp nie może przekraczać ${maxExcerptLength} znaków.`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.put(`/api/admin/articles/${editingArticle._id}`, data, {
        headers: { 'x-auth-token': token },
      });

      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: null,
      });
      setEditingArticle(null);
      setShowEditModal(false);
      setErrorMessage('');
      setSuccessMessage('Artykuł został zaktualizowany pomyślnie.');
      fetchArticles();
    } catch (error) {
      console.error('Błąd podczas zapisywania artykułu:', error);
      setErrorMessage('Wystąpił błąd podczas zapisywania artykułu.');
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/articles/${articleId}`, {
          headers: { 'x-auth-token': token },
        });
        fetchArticles();
      } catch (error) {
        console.error('Błąd podczas usuwania artykułu:', error);
      }
    }
  };

  if (!isAuthenticated || userRole !== 'Admin') {
    return <p className="text-danger">Brak dostępu.</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Zarządzaj artykułami</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Dodaj nowy artykuł</h3>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <div className="mb-3">
          <label className="form-label">Tytuł</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <small className="text-muted">
            Maksymalna długość: {maxTitleLength} znaków
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label">Wstęp</label>
          <textarea
            className="form-control"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="2"
            required
          ></textarea>
          <small className="text-muted">
            Maksymalna długość: {maxExcerptLength} znaków
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label">Treść</label>
          <textarea
            className="form-control"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="5"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Obraz</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Dodaj artykuł
        </button>
      </form>

      <hr />

      <h3>Lista artykułów</h3>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Table striped bordered hover className="mt-3" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Tytuł</th>
            <th style={{ width: '60%' }}>Wstęp</th>
            <th style={{ width: '20%' }}>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {article.title}
              </td>
              <td style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {article.excerpt}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(article)}
                >
                  Edytuj
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(article._id)}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingArticle && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edytuj artykuł</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Tytuł</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <Form.Text className="text-muted">
                  Maksymalna długość: {maxTitleLength} znaków
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formExcerpt">
                <Form.Label>Wstęp</Form.Label>
                <Form.Control
                  as="textarea"
                  name="excerpt"
                  rows={2}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                />
                <Form.Text className="text-muted">
                  Maksymalna długość: {maxExcerptLength} znaków
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formContent">
                <Form.Label>Treść</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  rows={5}
                  value={formData.content}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Obraz</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                />
                {editingArticle.imageUrl && (
                  <img
                    src={editingArticle.imageUrl}
                    alt="Obraz artykułu"
                    style={{ width: '200px', marginTop: '10px' }}
                  />
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Anuluj
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Zapisz zmiany
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminArticles;
