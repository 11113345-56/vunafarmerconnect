import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home-hero">
      <div className="container">
        <div className="hero-content">
          <h1>FarmConnect</h1>
          <p>Connect directly with trusted farmers, fresh produce, and serious agricultural buyers across Uganda.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-light btn-lg" to="/products">Browse produce</Link>
            <Link className="btn btn-outline-light btn-lg" to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
