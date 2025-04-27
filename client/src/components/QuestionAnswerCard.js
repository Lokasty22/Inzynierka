import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  Button,
  Spinner,
  Modal,
  Row,
  Col,
  Form,
  Alert,
} from "react-bootstrap";
import ProfilePicture from "./ProfilePicture";
import { FaEdit, FaTrash, FaPencilAlt, FaStar } from "react-icons/fa";
import moment from "moment";

const QuestionAnswerCard = ({ question, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = (answer) => {
    setCurrentAnswer(answer);
    setEditComment(answer.comment || "");
    setShowEditModal(true);
  };

  const handleDelete = (answer) => {
    setCurrentAnswer(answer);
    setShowDeleteModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError("");
    const commentRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,!?;:'"()\[\]\s-]{10,500}$/;
    if (!commentRegex.test(editComment)) {
      setError(
        "Komentarz zawiera niedozwolone znaki lub jest za krótki. Minimum 10 znaków."
      );
      setEditLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Brak tokenu uwierzytelniającego. Zaloguj się ponownie.");
        setEditLoading(false);
        return;
      }

      await axios.put(
        `/api/questions/${question._id}/answers/${currentAnswer._id}`,
        { comment: editComment },
        {
          headers: { "x-auth-token": token },
        }
      );
      onUpdate();
      setShowEditModal(false);
      setCurrentAnswer(null);
      setEditComment("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Błąd podczas edycji odpowiedzi."
      );
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Brak tokenu uwierzytelniającego. Zaloguj się ponownie.");
        setDeleteLoading(false);
        return;
      }

      await axios.delete(
        `/api/questions/${question._id}/answers/${currentAnswer._id}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      onUpdate();
      setShowDeleteModal(false);
      setCurrentAnswer(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Błąd podczas usuwania odpowiedzi."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitAddAnswer = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");
    const commentRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,!?;:'"()\[\]\s-]{10,500}$/;
    if (!commentRegex.test(newComment)) {
      setError(
        "Komentarz zawiera niedozwolone znaki lub jest za krótki. Minimum 10 znaków."
      );
      setAddLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Brak tokenu uwierzytelniającego. Zaloguj się ponownie.");
        setAddLoading(false);
        return;
      }

      await axios.post(
        `/api/questions/${question._id}/answers`,
        { comment: newComment },
        {
          headers: { "x-auth-token": token },
        }
      );
      onUpdate();
      setNewComment("");
      setShowAddModal(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Błąd podczas dodawania odpowiedzi."
      );
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      {question.comment && question.comment.length > 0 ? (
        question.comment.map((singleAnswer) => {
          const teacher = singleAnswer.teacher;
          const isOwner =
            user && teacher && user._id === teacher._id;

          return (
            <Card key={singleAnswer._id} className="mb-3">
              <Card.Header className="d-flex align-items-center">
                {teacher ? (
                  <ProfilePicture user={teacher} size={50} />
                ) : (
                  <ProfilePicture user={null} size={50} defaultAvatar />
                )}
                <div className="ms-3 flex-grow-1">
                  <h6 className="mb-0">
                    {teacher
                      ? `${teacher.firstName} ${teacher.lastName}`
                      : "Usunięty użytkownik"}
                  </h6>
                  <small className="text-muted">
                    {moment(singleAnswer.createdAt).format("DD.MM.YYYY, HH:mm")}
                    {singleAnswer.updatedAt && (
                      <span>
                        {" "}
                        <FaPencilAlt className="ms-2" /> Edytowano:{" "}
                        {moment(singleAnswer.updatedAt).format(
                          "DD.MM.YYYY, HH:mm"
                        )}
                      </span>
                    )}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <p>{singleAnswer.comment || "Brak komentarza."}</p>
                    <div className="d-flex justify-content-end">
                      {isOwner && teacher && (
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(singleAnswer)}
                          >
                            <FaEdit className="me-1" /> Edytuj
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(singleAnswer)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              <>
                                <FaTrash className="me-1" />
                                Usuń
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p></p>
      )}

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edytuj odpowiedź</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitEdit}>
            <Form.Group controlId="editComment" className="mb-3">
              <Form.Label>Komentarz</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-end">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="me-2"
              >
                Anuluj
              </Button>
              <Button variant="primary" type="submit" disabled={editLoading}>
                {editLoading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Zapisz"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Potwierdź usunięcie</Modal.Title>
        </Modal.Header>
        <Modal.Body>Czy na pewno chcesz usunąć tę odpowiedź?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Anuluj
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Usuń"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj odpowiedź</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitAddAnswer}>
            <Form.Group controlId="newComment" className="mb-3">
              <Form.Label>Komentarz</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-end">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
                className="me-2"
              >
                Anuluj
              </Button>
              <Button variant="primary" type="submit" disabled={addLoading}>
                {addLoading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Dodaj"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default QuestionAnswerCard;
