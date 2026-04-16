import GeneratorForm from '@/components/generator/GeneratorForm'

export const metadata = { title: 'Generer un exercice' }

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Nouveau livrable pedagogique</h1>
        <p className="text-nawer-text-secondary text-sm mt-1">Aligne programme MEN · Exercice + corrige simultanement</p>
      </div>
      <GeneratorForm />
    </div>
  )
}
