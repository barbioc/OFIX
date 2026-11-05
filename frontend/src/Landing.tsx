import { useState } from 'react'

const HERO_IMG =
  'https://images.unsplash.com/photo-1787166025559-fa9627be160b?w=1000&h=1200&fit=crop&auto=format'

const steps = [
  { n: '01', t: 'Publicá lo que necesitás', d: 'Describí el trabajo y tu ubicación. Si buscás un gasista, lo pedís en segundos.' },
  { n: '02', t: 'Te asignamos al mejor', d: 'Notificamos a profesionales disponibles y cercanos, con buena puntuación.' },
  { n: '03', t: 'Aceptás y listo', d: 'Mirá su perfil, aceptá o rechazá. Después calificalo con estrellas.' },
]

const features = [
  { t: 'Calificaciones reales', d: 'Estrellas y opiniones de usuarios que ya contrataron.', c: 'orange' },
  { t: 'Identidad validada', d: 'Cada profesional verifica su identidad y certificaciones.', c: 'blue' },
  { t: 'Cerca de tu casa', d: 'Geolocalización para vincularte con quien está en tu zona.', c: 'blue' },
  { t: 'Datos protegidos', d: 'Tu información sensible nunca se expone sin necesidad.', c: 'orange' },
]

const nav = [
  ['Información', '#info'],
  ['Cómo funciona', '#como'],
  ['Contacto', '#contacto'],
]

export default function Landing() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen bg-white text-ink font-body">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="font-display text-2xl font-extrabold tracking-tight">
            ofix<span className="text-orange">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-sm font-medium transition-colors hover:text-blue">
                {l}
              </a>
            ))}
            <a
              href="#/registro"
              className="rounded-full border-2 border-ink px-5 py-[6px] text-sm font-semibold transition hover:border-blue hover:text-blue"
            >
              Registrarse
            </a>
            <a
              href="#/login"
              className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Iniciar sesión
            </a>
          </nav>
          <button
            className="md:hidden rounded-full border border-black/20 px-4 py-2 text-sm font-medium"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-4 border-t border-black/10 px-6 py-5 md:hidden">
            {nav.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="font-medium">
                {l}
              </a>
            ))}
            <a href="#/registro" className="rounded-full border-2 border-ink px-5 py-2.5 text-center font-semibold">
              Registrarse
            </a>
            <a href="#/login" className="rounded-full bg-blue px-5 py-3 text-center font-semibold text-white">
              Iniciar sesión
            </a>
          </div>
        )}
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="mb-6 inline-block rounded-full bg-orange-soft px-4 py-1.5 text-sm font-semibold text-orange">
              Appweb para conectar con profesionales
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              El profesional que tu hogar necesita,{' '}
              <span className="text-blue">calificado</span> y{' '}
              <span className="relative whitespace-nowrap text-orange">en tu puerta</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-black/70">
              Encontrá gasistas, electricistas y más. Contratá con confianza gracias a calificaciones y opiniones de usuarios reales.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#/login" className="rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition hover:bg-ink">
                Iniciar sesión
              </a>
              <a href="#info" className="rounded-full border-2 border-ink px-7 py-3.5 font-semibold transition hover:border-blue hover:text-blue">
                Información sobre Ofix
              </a>
              <a href="#contacto" className="rounded-full px-5 py-3.5 font-semibold text-blue underline-offset-4 hover:underline">
                Contacto →
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-blue" aria-hidden />
            <img
              src={HERO_IMG}
              alt="Puerta blanca de una casa de ladrillo rojo, lista para recibir a un profesional"
              className="relative aspect-[4/5] w-full rounded-[2rem] bg-blue-soft object-cover"
            />
            <div className="absolute -bottom-5 -left-4 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-black/10">
              <p className="text-xl text-orange" aria-label="5 estrellas">★★★★★</p>
              <p className="text-sm font-semibold">Gasista · disponible ahora</p>
            </div>
          </div>
        </section>

        <section id="info" className="border-y border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange">Sobre Ofix</p>
                <h2 className="font-display text-4xl font-bold leading-tight">Confianza antes de que toquen el timbre.</h2>
              </div>
              <div>
                <p className="text-xl leading-relaxed text-black/75">
                  Ofix es un sistema que facilita la búsqueda y el contacto entre clientes y profesionales capacitados, generando confianza a través de calificaciones y opiniones de usuarios reales.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {features.map((f) => (
                    <div
                      key={f.t}
                      className={`rounded-2xl p-6 transition hover:-translate-y-1 ${f.c === 'blue' ? 'bg-blue-soft' : 'bg-orange-soft'}`}
                    >
                      <h3 className={`font-display text-lg font-bold ${f.c === 'blue' ? 'text-blue' : 'text-orange'}`}>{f.t}</h3>
                      <p className="mt-2 text-black/75">{f.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como" className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue">Cómo funciona</p>
          <h2 className="mb-12 max-w-2xl font-display text-4xl font-bold leading-tight">Tres pasos entre el problema y la solución.</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t-2 border-ink pt-6">
                <span className="font-display text-5xl font-extrabold text-orange">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-black/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-8 rounded-[2rem] bg-blue p-10 text-white md:grid-cols-2 md:p-14">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">¿Sos profesional? Sumate a Ofix.</h2>
              <p className="mt-4 text-white/85">Recibí alertas de órdenes de trabajo, definí tus horarios y aceptá los pedidos que te convienen.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <a href="#/login" className="rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-ink">
                Registrarme como profesional
              </a>
              <a href="#/login" className="rounded-full border-2 border-white px-7 py-3.5 font-semibold transition hover:bg-white hover:text-blue">
                Soy cliente
              </a>
            </div>
          </div>
        </section>

        <section id="contacto" className="border-t border-black/10">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange">Contacto</p>
              <h2 className="font-display text-4xl font-bold leading-tight">Hablemos.</h2>
              <p className="mt-4 max-w-md text-black/70">Escribinos tus dudas sobre la plataforma y te respondemos a la brevedad.</p>
            </div>
            {sent ? (
              <div className="self-center rounded-2xl bg-blue-soft p-8 text-lg font-semibold text-blue">
                ¡Gracias! Recibimos tu mensaje.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="space-y-4"
              >
                {[
                  ['Nombre', 'text'],
                  ['Correo electrónico', 'email'],
                ].map(([l, t]) => (
                  <label key={l} className="block text-sm font-semibold">
                    {l}
                    <input
                      required
                      type={t}
                      className="mt-1.5 w-full rounded-xl border border-black/20 px-4 py-3 font-normal outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30"
                    />
                  </label>
                ))}
                <label className="block text-sm font-semibold">
                  Mensaje
                  <textarea
                    required
                    rows={4}
                    className="mt-1.5 w-full rounded-xl border border-black/20 px-4 py-3 font-normal outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30"
                  />
                </label>
                <button className="rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition hover:bg-orange">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-sm text-black/60">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2">
          <span className="font-display font-bold text-ink">ofix<span className="text-orange">.</span></span>
          <span>© 2026 Ofix. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  )
}
