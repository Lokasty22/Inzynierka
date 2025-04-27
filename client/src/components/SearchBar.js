import React, { useState } from 'react';
import axios from 'axios';
import SubjectList from './SubjectList';
import CityList from './CityList';
import StateList from './StateList';

const SearchBar = ({ setSubject, subject, setCity, city, setState, state, setSortOption, sortOption, setPage, handleFilterSubmit}) => { 
  const handleSearch = async (e) => {
    e.preventDefault();
    try{
      setPage(1);
    }
    catch(err){
      console.error(err);
    }
  };

  const handleClearFilter = () => {
    setSubject('');
    setCity('');
    setState('');
    setSortOption('');
    setPage(1);
  }

  return (
    <form className="search-bar-form mb-5" onSubmit={handleFilterSubmit} >
      <div className="input-group search-bar">
        <SubjectList subject={subject} setSubject={setSubject} /> 
        <CityList city={city} setCity={setCity} />
        <StateList state={state} setState={setState} />
          <select className="form-select form-select-sm" 
                value={sortOption}
                onChange={(e) =>  setSortOption(e.target.value)}>
                    <option value="">Sortuj</option>
                    <option value="price-high">Cena (Najwyższa)</option>
                    <option value="price-low">Cena (Najniższa)</option>
                    <option value="date-new">Data (Najnowsza)</option>
                    <option value="date-old">Data (Najstarsza)</option>
                </select>
            <button className="btn btn-primary" type="submit">Szukaj</button>
            <button className="btn btn-secondary" onClick={() => handleClearFilter()}>Wyczyść filtry</button>
      </div>
    </form>
  );
};

export default SearchBar;
