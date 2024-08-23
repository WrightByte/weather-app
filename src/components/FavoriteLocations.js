import React from 'react';
import '../styles/FavoriteLocations.css';

const FavoriteLocations = ({ favorites, onSelect, onRemove }) => {
  return (
    <div className="favorite-locations">
      <h3>Favorite Locations</h3>
      {favorites.length === 0 ? (
        <p>No favorite locations added yet.</p>
      ) : (
        <ul>
          {favorites.map((location, index) => (
            <li key={index}>
              <button onClick={() => onSelect(location.name)} className="select-favorite">
                {location.name}
              </button>
              <button onClick={() => onRemove(location)} className="remove-favorite">
                <i className="fas fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteLocations;
