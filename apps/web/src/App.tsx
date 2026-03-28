const signals = [
  'Collect prospect data',
  'Draft outreach sequences',
  'Review performance metrics',
]

export default function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Frontend initialized</p>
        <h1>LinkedIn Agent has a web surface now.</h1>
        <p className="lede">
          This placeholder landing page confirms the React and TypeScript app is
          wired up and ready for product work.
        </p>
        <div className="actions">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            Vite docs
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            React docs
          </a>
        </div>
      </section>

      <section className="panel" aria-label="Initial capabilities">
        <h2>Starter focus areas</h2>
        <ul>
          {signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
