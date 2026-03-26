'use client'

export default function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
        {title}
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-medium">
        {subtitle}
      </p>
    </div>
  )
}
