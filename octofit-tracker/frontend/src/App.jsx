function App() {
  return (
    <main className="container py-5">
      <header className="d-flex align-items-center gap-3">
        <img
          src="/octofitapp-small.png"
          alt="OctoFit Tracker"
          width="72"
          height="72"
        />
        <div>
          <p className="mb-1 text-uppercase text-secondary small">OctoFit</p>
          <h1 className="h2 mb-0">Tracker</h1>
        </div>
      </header>
      <section className="mt-5 border-top pt-4" aria-labelledby="welcome-title">
        <h2 id="welcome-title" className="h4">Your activity, in focus.</h2>
        <p className="text-secondary mb-0">
          Your personalized fitness dashboard starts here.
        </p>
      </section>
    </main>
  )
}

export default App
