import { useState } from 'react'

type Role = 'cliente' | 'profesional'
type Mode = 'entrar' | 'olvide'

const roles: { id: Role; label: string; note: string }[] = [
  { id: 'cliente', label: 'Cliente', note: 'Busco un profesional para mi hogar' },
  { id: 'profesional', label: 'Profesional', note: 'Quiero recibir órdenes de trabajo' },
]

const input =
  'mt-1.5 w-full rounded-xl border border-black/20 px-4 py-3 font-normal outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30'

export default function Login() {
  const [role, setRole] = useState<Role>('cliente')
  const [mode, setMode] = useState<Mode>('entrar')
  const [done, setDone] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const who = role === 'cliente' ? 'cliente' : 'profesional'
    if (mode === 'entrar') {
      window.location.hash = role === 'profesional' ? '#/profesional' : '#/cliente'
      return
    }
    setDone(
      mode === 'olvide'
        ? 'Te enviamos un enlace para restablecer tu contraseña.'
        : `Sesión iniciada como ${who}.`,
    )
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setDone('')
  }

  const title = mode === 'entrar' ? 'Iniciar sesión' : 'Recuperar contraseña'

  return (
    <div className="grid min-h-screen bg-white text-ink lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-blue p-12 text-white lg:flex">
        <a href="#inicio" className="font-display text-2xl font-extrabold">
          ofix<span className="text-orange">.</span>
        </a>
        <div>
          <h2 className="font-display text-5xl font-extrabold leading-[1.05]">
            El profesional que tu hogar necesita, <span className="text-orange">en tu puerta.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-white/90">
            <li>★ Calificaciones de usuarios reales</li>
            <li>★ Identidad y certificaciones validadas</li>
            <li>★ Tus datos siempre protegidos</li>
          </ul>
        </div>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange/90" aria-hidden />
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-12">
        <a
          href="#inicio"
          className="self-start rounded-full border border-black/20 px-4 py-2 text-sm font-semibold transition hover:border-blue hover:text-blue"
        >
          ← Volver al inicio
        </a>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-black/65">
            {mode === 'olvide'
              ? 'Ingresá tu correo y te enviaremos las instrucciones.'
              : 'Elegí cómo querés ingresar.'}
          </p>

          {mode !== 'olvide' && (
            <div role="radiogroup" aria-label="Tipo de cuenta" className="mt-7 grid grid-cols-2 gap-3">
              {roles.map((r) => {
                const on = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRole(r.id)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      on ? 'border-blue bg-blue-soft' : 'border-black/15 hover:border-black/40'
                    }`}
                  >
                    <span className={`block font-display text-lg font-bold ${on ? 'text-blue' : ''}`}>
                      {on ? '● ' : '○ '}
                      {r.label}
                    </span>
                    <span className="mt-1 block text-xs text-black/65">{r.note}</span>
                  </button>
                )
              })}
            </div>
          )}

          {done ? (
            <div role="status" className="mt-7 rounded-2xl bg-orange-soft p-5 font-semibold text-orange">
              {done}
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">
                Correo electrónico
                <input required type="email" autoComplete="email" className={input} />
              </label>
              {mode !== 'olvide' && (
                <label className="block text-sm font-semibold">
                  Contraseña
                  <input
                    required
                    type="password"
    autoComplete="current-password"
                    className={input}
                  />
                </label>
              )}
              {mode === 'entrar' && (
                <button
                  type="button"
                  onClick={() => switchMode('olvide')}
                  className="text-sm font-semibold text-blue underline-offset-4 hover:underline"
                >
                  Olvidé mi contraseña
                </button>
              )}
              <button className="w-full rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
                {mode === 'entrar' ? `Entrar como ${role}` : 'Enviar enlace'}
              </button>
            </form>
          )}

          <p className="mt-8 text-sm text-black/70">
            {mode === 'olvide' ? (
              <button onClick={() => switchMode('entrar')} className="font-semibold text-blue hover:underline">
                ← Volver a iniciar sesión
              </button>
            ) : (
              <>
                ¿Sos nuevo en Ofix?{' '}
                <a
                  href="#/registro"
                  className="font-semibold text-blue hover:underline"
                >
                  Crear una cuenta
                </a>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}
