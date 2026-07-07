function About() {
  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <h1 className="section-title">About FarmConnect</h1>
          <p className="lead">
            FarmConnect helps farmers publish produce listings and helps buyers discover available crops, compare prices, and send order requests.
          </p>
          <p>
            This project is built for full-stack development students. It demonstrates React routing, JWT authentication, role-based dashboards, Express controllers, and MariaDB relationships using a practical marketplace example.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            className="rounded content-photo"
            alt="Fresh farm produce"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
