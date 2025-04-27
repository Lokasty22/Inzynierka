import React from "react";
import { Form } from "react-bootstrap";

const StateList = ({ state, setState, disabled }) => {
  return (
    <Form.Select
      value={state}
      onChange={(e) => setState(e.target.value)}
      name="state"
      disabled={disabled} 
    >
      <option value="">Wybierz województwo</option>
      <option value="Dolnośląskie">Dolnośląskie</option>
      <option value="Kujawsko-pomorskie">Kujawsko-pomorskie</option>
      <option value="Lubelskie">Lubelskie</option>
      <option value="Lubuskie">Lubuskie</option>
      <option value="Łódzkie">Łódzkie</option>
      <option value="Małopolskie">Małopolskie</option>
      <option value="Mazowieckie">Mazowieckie</option>
      <option value="Opolskie">Opolskie</option>
      <option value="Podkarpackie">Podkarpackie</option>
      <option value="Podlaskie">Podlaskie</option>
      <option value="Pomorskie">Pomorskie</option>
      <option value="Śląskie">Śląskie</option>
      <option value="Świętokrzyskie">Świętokrzyskie</option>
      <option value="Warmińsko-mazurskie">Warmińsko-mazurskie</option>
      <option value="Wielkopolskie">Wielkopolskie</option>
      <option value="Zachodniopomorskie">Zachodniopomorskie</option>
    </Form.Select>
  );
};

export default StateList;
