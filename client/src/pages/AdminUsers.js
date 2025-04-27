import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useCallback } from "react";
const AdminUsers = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [surrnameFilter, setSurrnameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [moneyFilter, setMoneyFilter] = useState("");
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const params = { ...filters };
      const res = await axios.get("/api/admin/users", {
        headers: { "x-auth-token": token },
        params: params,
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
    }
  }, [isAuthenticated, userRole, filters]);

  useEffect(() => {
    if (isAuthenticated && userRole === "Admin") {
      fetchUsers();
    }
  }, [fetchUsers]);
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { "x-auth-token": token },
        });
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Błąd podczas usuwania użytkownika:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role,
        balance: editingUser.balance,
      };
      await axios.put(`/api/admin/users/${editingUser._id}`, updatedUser, {
        headers: { "x-auth-token": token },
      });
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? editingUser : user,
        ),
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Błąd podczas aktualizacji użytkownika:", error);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filtersApplied = {};
    if (nameFilter) filtersApplied.nameFilter = nameFilter;
    if (surrnameFilter) filtersApplied.surrnameFilter = surrnameFilter;
    if (emailFilter) filtersApplied.emailFilter = emailFilter;
    if (roleFilter) filtersApplied.roleFilter = roleFilter;
    if (moneyFilter) filtersApplied.moneyFilter = moneyFilter;
    setFilters(filtersApplied);
  };
  const handleClearFilters = () => {
    setNameFilter("");
    setSurrnameFilter("");
    setEmailFilter("");
    setRoleFilter("");
    setMoneyFilter("");
    setFilters({});
  };

  if (!isAuthenticated || userRole !== "Admin") {
    return <p>Brak dostępu.</p>;
  }

  return (
    <div className="container my-5">
      <h2>Zarządzaj użytkownikami</h2>
      <Form className="mb-4" onSubmit={handleFilterSubmit}>
        <Row>
          <Col md={2}>
            <Form.Group controlId="filterName">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                type="text"
                placeholder="Imie"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterSurrname">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwisko"
                value={surrnameFilter}
                onChange={(e) => setSurrnameFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="filterRole">
              <Form.Label>Rola</Form.Label>
              <Form.Control
                as="select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Wszystkie</option>
                {["Uczeń", "Nauczyciel", "Admin"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="filterMoney">
              <Form.Label>Saldo</Form.Label>
              <Form.Control
                as="select"
                value={moneyFilter}
                onChange={(e) => setMoneyFilter(e.target.value)}
              >
                <option value="">Sortuj</option>
                {["Saldo(najwyższe)", "Saldo(najniższe)"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="me-2"
            >
              Wyczyść filtry
            </Button>
            <Button variant="primary" type="submit">
              Filtruj
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Saldo</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.balance || 0}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  Edytuj
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingUser && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edytuj użytkownika</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      firstName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Rola</Form.Label>
                <Form.Control
                  as="select"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="Nauczyciel">Nauczyciel</option>
                  <option value="Uczeń">Uczeń</option>
                  <option value="Admin">Admin</option>
                </Form.Control>
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

export default AdminUsers;
