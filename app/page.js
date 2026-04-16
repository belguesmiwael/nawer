import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold text-white">NAWER</span>
          <div className="flex gap-3">
            <Link href="/login" className="text-nawer-text-secondary text-sm hover:text-white">Connexion</Link>
            <Link href="/register" className="bg-accent-blue hover:bg-accent-blue-hover text-white text-sm font-medium px-4 py-2 rounded">Essai gratuit</Link>
          </div>
        </div>
      </nav>
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs px-3 py-1.5 rounded-full mb-8">
          Aligne programme MEN Tunisie
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">
          Generez vos exercices<br/>
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">en 8 secondes</span>
        </h1>
        <p className="text-xl text-nawer-text-secondary max-w-2xl mx-auto mb-10">
          Exercice + corrige detaille generes simultanement. Arabe, francais, anglais. Du primaire au Bac.
        </p>
        <Link href="/register" className="bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-glow-blue">
          Generer mon premier exercice - Gratuit
        </Link>
        <p className="text-nawer-text-muted text-sm mt-4">5 generations gratuites · Aucune carte bancaire</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🎯', t: 'Aligne MEN',    d: 'Objectifs officiels injectes dans chaque generation.' },
            { icon: '✅', t: 'Corrige inclus', d: 'Exercice + corrige detaille generes en un seul clic.'  },
            { icon: '📄', t: 'Export PDF',     d: 'Document academique pret a imprimer.'                  },
          ].map(f => (
            <div key={f.t} className="bg-bg-surface border border-border rounded-lg p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.t}</h3>
              <p className="text-nawer-text-secondary text-sm">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between text-nawer-text-muted text-xs">
          <span>2026 NAWER</span><span>Fait en Tunisie</span>
        </div>
      </footer>
    </div>
  )
}
