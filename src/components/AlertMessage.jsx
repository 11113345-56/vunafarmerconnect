function AlertMessage({ type = "info", message }) {
  if (!message) return null;
  return <div className={`alert alert-${type} mb-3`}>{message}</div>;
}

export default AlertMessage;
