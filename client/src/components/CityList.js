import React from "react";
import { Form } from "react-bootstrap";

const CityList = ({ city, setCity, disabled }) => {
  return (
    <Form.Select
      value={city}
      onChange={(e) => setCity(e.target.value)}
      name="city"
      size="5" 
      disabled={disabled} 
    >
      <option value="">Wybierz miasto</option>
      <option value="Warszawa">Warszawa</option>
      <option value="Kraków">Kraków</option>
      <option value="Łódź">Łódź</option>
      <option value="Wrocław">Wrocław</option>
      <option value="Poznań">Poznań</option>
      <option value="Gdańsk">Gdańsk</option>
      <option value="Szczecin">Szczecin</option>
      <option value="Bydgoszcz">Bydgoszcz</option>
      <option value="Lublin">Lublin</option>
      <option value="Białystok">Białystok</option>
      <option value="Katowice">Katowice</option>
      <option value="Gorzów Wielkopolski">Gorzów Wielkopolski</option>
      <option value="Zielona Góra">Zielona Góra</option>
      <option value="Rzeszów">Rzeszów</option>
      <option value="Opole">Opole</option>
      <option value="Kielce">Kielce</option>
      <option value="Olsztyn">Olsztyn</option>
      <option value="Toruń">Toruń</option>
    </Form.Select>
  );
};

export default CityList;
