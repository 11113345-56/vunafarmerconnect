import { Link } from "react-router-dom";

function Favorites() {
  const favorites = JSON.parse(localStorage.getItem("farmconnect_favorites") || "[]");

  return (
    <>
      <h1 className="section-title">Favorites</h1>
      <div className="action-panel">
        {favorites.length === 0 ? (
          <p className="text-muted mb-0">No favorites saved yet. Open a product detail page and save products you want to revisit.</p>
        ) : (
          <ul className="mb-0">
            {favorites.map((id) => <li key={id}><Link to={`/products/${id}`}>Product #{id}</Link></li>)}
          </ul>
        )}
      </div>
    </>
  );
}

export default Favorites;
