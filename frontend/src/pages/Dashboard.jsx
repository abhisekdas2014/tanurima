import Layout from "../layout/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h3>Welcome to  Admin Panel</h3>
      <p className="text-muted">
        Use the sidebar to manage customers, items, stock, and orders.
      </p>
    </Layout>
  );
}

