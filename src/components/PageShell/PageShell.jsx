import "./PageShell.css";

function PageShell({ title, subtitle, children }) {
  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default PageShell;
