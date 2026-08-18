export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type = "blue"
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <span>{title}</span>

        <div className={`stat-icon ${type}`}>
          <Icon size={19} />
        </div>

      </div>

      <h2>{value}</h2>

      <div className="stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
}