import Card from "../components/common/Card";

function Dashboard() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        Card Title
      </h2>
      <p className="text-[var(--text-secondary)]">This is card content.</p>
    </Card>
  );
}
export default Dashboard;
