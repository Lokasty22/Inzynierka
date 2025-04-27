import React from 'react';


const SubjectList = ({subject, setSubject}) => {
    return(

        <select
        className="form-select"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        >
        <option value="">Wybierz przedmiot</option>
        <option value="Matematyka">Matematyka</option>
        <option value="Fizyka">Fizyka</option>
        <option value="Chemia">Chemia</option>
        <option value="Biologia">Biologia</option>
        <option value="Geografia">Geografia</option>
        <option value="Historia">Historia</option>
        <option value="Wiedza o społeczeństwie">Wiedza o społeczeństwie</option>
        <option value="Angielski">Angielski</option>
        <option value="Polski">Polski</option>
        <option value="Niemiecki">Niemiecki</option>
        <option value="Hiszpański">Hiszpański</option>
        <option value="Francuski">Francuski</option>
        <option value="Włoski">Włoski</option>
        <option value="Łacina">Łacina</option>
        <option value="Filozofia">Filozofia</option>
        <option value="Muzyka">Muzyka</option>
        <option value="Gra na instrumencie">Gra na instrumencie</option>
        <option value="Zajęcia sportowe">Zajęcia sportowe</option>
        </select>
    )
}

export default SubjectList;