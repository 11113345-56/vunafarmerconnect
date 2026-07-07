import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { inquiryService } from "../../services/inquiryService";

function FarmerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInquiries() {
    const response = await inquiryService.getFarmerInquiries();
    setInquiries(response.data.inquiries);
  }

  useEffect(() => {
    loadInquiries().catch(() => setError("Unable to load inquiries.")).finally(() => setLoading(false));
  }, []);

  async function markAnswered(id) {
    await inquiryService.updateStatus(id, "answered");
    await loadInquiries();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Buyer Inquiries</h1>
      <AlertMessage type="danger" message={error} />
      <div className="row g-3">
        {inquiries.map((inquiry) => (
          <div className="col-lg-6" key={inquiry.id}>
            <div className="action-panel h-100">
              <div className="d-flex justify-content-between">
                <h2 className="h5">{inquiry.product_name}</h2>
                <span className="badge bg-secondary align-self-start">{inquiry.status}</span>
              </div>
              <p>{inquiry.message}</p>
              <p className="small text-muted mb-3">{inquiry.buyer_name} · {inquiry.buyer_phone}</p>
              <button className="btn btn-sm btn-outline-success" onClick={() => markAnswered(inquiry.id)}>Mark answered</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FarmerInquiries;
