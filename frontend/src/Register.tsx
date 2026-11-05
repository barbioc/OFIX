import { useEffect, useState } from 'react'

type Role = 'cliente' | 'profesional'

const OFICIOS = ['Gasista', 'Electricista', 'Plomero'] as const
type Oficio = (typeof OFICIOS)[number]

const PROVINCIAS = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
type Horario = { on: boolean; desde: string; hasta: string }
const horariosIniciales = (): Horario[] =>
  DIAS.map((_, i) => ({ on: i < 5, desde: '08:00', hasta: '18:00' }))

type Cert = { id: number; nombre: string; file: File | null }

const input =
  'mt-1.5 w-full rounded-xl border border-black/20 bg-white px-4 py-3 font-normal outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30'
const label = 'block text-sm font-semibold'
const primary =
  'rounded-full bg-orange px-7 py-3.5 font-semibold text-white transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
const secondary =
  'rounded-full border-2 border-ink px-7 py-3 font-semibold transition hover:border-blue hover:text-blue'

const roles: { id: Role; label: string; note: string }[] = [
  { id: 'cliente', label: 'Registrarme como cliente', note: 'Busco un profesional para mi hogar' },
  { id: 'profesional', label: 'Registrarme como profesional', note: 'Quiero recibir órdenes de trabajo' },
]

let certSeq = 1

export default function Register() {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role | null>(null)
  const [data, setData] = useState<Record<string, string>>({})
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [oficios, setOficios] = useState<Partial<Record<Oficio, string>>>({})
  const [radio, setRadio] = useState(25)
  const [horarios, setHorarios] = useState<Horario[]>(horariosIniciales)
  const [certs, setCerts] = useState<Cert[]>([])
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!photo) return setPhotoUrl('')
    const u = URL.createObjectURL(photo)
    setPhotoUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [photo])

  const isPro = role === 'profesional'
  const total = isPro ? 4 : 3
  const val = (k: string) => data[k] ?? ''
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }))

  const go = (n: number) => {
    setError('')
    setStep(n)
    window.scrollTo(0, 0)
  }

  const finish = () => {
    setDone(true)
    window.scrollTo(0, 0)
  }

  const next = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 0) {
      if (!role) return setError('Elegí cómo querés registrarte para continuar.')
      return go(1)
    }
    if (step === 1) {
      if (val('password') !== val('password2')) return setError('Las contraseñas no coinciden.')
      return go(2)
    }
    if (step === 2) {
      if (!val('provincia')) return setError('Elegí tu provincia.')
      const hasAddr = val('calle') || val('nro') || val('depto')
      if (!isPro && hasAddr && (!val('calle') || !val('nro')))
        return setError('Si cargás la dirección, completá al menos calle y número.')
      return isPro ? go(3) : finish()
    }
    if (step === 3) {
      if (Object.keys(oficios).length === 0) return setError('Elegí al menos una profesión.')
      if (Object.values(oficios).some((a) => a === '' || a === undefined))
        return setError('Indicá los años de experiencia en cada profesión.')
      if (!horarios.some((h) => h.on)) return setError('Elegí al menos un día de atención.')
      if (horarios.some((h) => h.on && h.desde >= h.hasta))
        return setError('En cada día, la hora de inicio debe ser anterior a la de cierre.')
      if (certs.some((c) => !c.file)) return setError('Adjuntá un archivo en cada certificación, o quitala.')
      return finish()
    }
  }

  const toggleOficio = (o: Oficio) =>
    setOficios((cur) => {
      const n = { ...cur }
      if (o in n) delete n[o]
      else n[o] = ''
      return n
    })

  const updateHorario = (i: number, p: Partial<Horario>) =>
    setHorarios((hs) => hs.map((h, j) => (j === i ? { ...h, ...p } : h)))
  const updateCert = (id: number, p: Partial<Cert>) =>
    setCerts((cs) => cs.map((c) => (c.id === id ? { ...c, ...p } : c)))

  const titles = ['¿Cómo vas a usar Ofix?', 'Tu cuenta', 'Tus datos', 'Tu perfil profesional']
  const subs = [
    'Elegí el tipo de cuenta que querés crear.',
    'Con estos datos vas a iniciar sesión.',
    isPro ? 'Estos datos validan tu identidad. La dirección es obligatoria.' : 'Para que los profesionales te conozcan y puedan llegar a vos.',
    'Contanos qué hacés, dónde trabajás y cuándo.',
  ]

  return (
    <div className="grid min-h-screen bg-white text-ink lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-blue p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
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

        <div className="mx-auto w-full max-w-xl flex-1 py-10">
          {done ? (
            <div role="status" className="rounded-2xl bg-orange-soft p-6">
              <h1 className="font-display text-3xl font-extrabold text-ink">¡Listo, {val('nombre')}!</h1>
              <p className="mt-3 font-semibold text-orange">
                {isPro
                  ? 'Tu perfil profesional fue creado y quedó "pendiente de validación" mientras revisamos tu identidad y certificaciones.'
                  : 'Tu cuenta de cliente fue creada. Ya podés iniciar sesión.'}
              </p>
              <a href="#/login" className={`${primary} mt-6 inline-block`}>
                Ir a iniciar sesión
              </a>
            </div>
          ) : (
            <>
              <div aria-label={`Paso ${step + 1} de ${total}`} className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-black/55">
                  <span>
                    Paso {step + 1} de {total}
                  </span>
                  <span>{Math.round(((step + 1) / total) * 100)}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-valuenow={step + 1}
                  className="mt-2 flex gap-1.5"
                >
                  {Array.from({ length: total }, (_, i) => (
                    <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10">
                      <div className={`h-full bg-blue transition-all duration-500 ${i <= step ? 'w-full' : 'w-0'}`} />
                    </div>
                  ))}
                </div>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight">{titles[step]}</h1>
              <p className="mt-2 text-black/65">{subs[step]}</p>

              <form onSubmit={next} className="mt-7 space-y-5">
                {step === 0 && (
                  <div role="radiogroup" aria-label="Tipo de cuenta" className="grid gap-3">
                    {roles.map((r) => {
                      const on = role === r.id
                      return (
                        <button
                          key={r.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => {
                            setRole(r.id)
                            setError('')
                          }}
                          className={`rounded-2xl border-2 p-5 text-left transition ${
                            on ? 'border-blue bg-blue-soft' : 'border-black/15 hover:border-black/40'
                          }`}
                        >
                          <span className={`block font-display text-xl font-bold ${on ? 'text-blue' : ''}`}>
                            {on ? '● ' : '○ '}
                            {r.label}
                          </span>
                          <span className="mt-1 block text-sm text-black/65">{r.note}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 1 && (
                  <>
                    <label className={label}>
                      Correo electrónico
                      <input required type="email" maxLength={120} autoComplete="email" value={val('email')} onChange={set('email')} className={input} />
                    </label>
                    <label className={label}>
                      Contraseña
                      <input required type="password" minLength={8} autoComplete="new-password" value={val('password')} onChange={set('password')} className={input} />
                      <span className="mt-1 block text-xs font-normal text-black/55">Mínimo 8 caracteres.</span>
                    </label>
                    <label className={label}>
                      Verificar contraseña
                      <input required type="password" minLength={8} autoComplete="new-password" value={val('password2')} onChange={set('password2')} className={input} />
                    </label>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-black/25 bg-blue-soft text-xs text-black/50">
                        {photoUrl ? <img src={photoUrl} alt="Vista previa de la foto de perfil" className="size-full object-cover" /> : 'Sin foto'}
                      </div>
                      <div className="text-sm font-semibold">
                        Foto de perfil <span className="font-normal text-black/55">(opcional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                          className="mt-1.5 block text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-blue file:px-4 file:py-2 file:font-semibold file:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={label}>
                        Nombre
                        <input required maxLength={60} autoComplete="given-name" value={val('nombre')} onChange={set('nombre')} className={input} />
                      </label>
                      <label className={label}>
                        Apellido
                        <input required maxLength={60} autoComplete="family-name" value={val('apellido')} onChange={set('apellido')} className={input} />
                      </label>
                      <label className={label}>
                        Ciudad
                        <input required maxLength={60} autoComplete="address-level2" value={val('ciudad')} onChange={set('ciudad')} className={input} />
                      </label>
                      <label className={label}>
                        Provincia
                        <select required value={val('provincia')} onChange={set('provincia')} className={input}>
                          <option value="">Elegí una</option>
                          {PROVINCIAS.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </label>
                      <label className={label}>
                        Teléfono
                        <input required type="tel" maxLength={25} autoComplete="tel" value={val('telefono')} onChange={set('telefono')} className={input} />
                      </label>
                      <label className={label}>
                        DNI
                        <input required inputMode="numeric" pattern="[0-9]{7,8}" title="7 u 8 dígitos, sin puntos" placeholder="Sin puntos" value={val('dni')} onChange={set('dni')} className={input} />
                      </label>
                    </div>
                    <fieldset className="space-y-4 pt-2">
                      <legend className="font-display text-lg font-bold">
                        Dirección{' '}
                        <span className="text-sm font-normal text-black/55">{isPro ? '(obligatoria)' : '(opcional)'}</span>
                      </legend>
                      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                        <label className={label}>
                          Calle
                          <input required={isPro} maxLength={80} autoComplete="address-line1" value={val('calle')} onChange={set('calle')} className={input} />
                        </label>
                        <label className={label}>
                          Número
                          <input required={isPro} maxLength={10} value={val('nro')} onChange={set('nro')} className={input} />
                        </label>
                        <label className={label}>
                          Depto. <span className="font-normal text-black/55">(opc.)</span>
                          <input maxLength={10} autoComplete="address-line2" value={val('depto')} onChange={set('depto')} className={input} />
                        </label>
                      </div>
                    </fieldset>
                  </>
                )}

                {step === 3 && (
                  <>
                    <fieldset className="space-y-3">
                      <legend className="font-display text-lg font-bold">Profesiones</legend>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {OFICIOS.map((o) => {
                          const on = o in oficios
                          return (
                            <div key={o} className={`rounded-2xl border-2 p-3 transition ${on ? 'border-blue bg-blue-soft' : 'border-black/15'}`}>
                              <label className="flex cursor-pointer items-center gap-2 font-display font-bold">
                                <input type="checkbox" checked={on} onChange={() => toggleOficio(o)} className="size-4 accent-[#1553e0]" />
                                {o}
                              </label>
                              {on && (
                                <label className="mt-2 block text-xs font-semibold">
                                  Años de experiencia
                                  <input
                                    required
                                    type="number"
                                    min={0}
                                    max={70}
                                    value={oficios[o] ?? ''}
                                    onChange={(e) => setOficios((c) => ({ ...c, [o]: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 font-normal outline-none focus:border-blue"
                                  />
                                </label>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="radio" className="flex items-baseline justify-between font-display text-lg font-bold">
                        Radio de cobertura
                        <span className="text-blue">{radio} km</span>
                      </label>
                      <input
                        id="radio"
                        type="range"
                        min={1}
                        max={150}
                        value={radio}
                        onChange={(e) => setRadio(Number(e.target.value))}
                        className="mt-3 w-full accent-[#1553e0]"
                      />
                      <div className="flex justify-between text-xs text-black/55">
                        <span>1 km</span>
                        <span>150 km</span>
                      </div>
                    </div>

                    <fieldset className="space-y-2">
                      <legend className="font-display text-lg font-bold">Horarios de atención</legend>
                      {horarios.map((h, i) => (
                        <div key={DIAS[i]} className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 px-3 py-2">
                          <label className="flex w-32 cursor-pointer items-center gap-2 text-sm font-semibold">
                            <input type="checkbox" checked={h.on} onChange={(e) => updateHorario(i, { on: e.target.checked })} className="size-4 accent-[#1553e0]" />
                            {DIAS[i]}
                          </label>
                          {h.on ? (
                            <div className="flex items-center gap-2 text-sm">
                              <input type="time" aria-label={`${DIAS[i]} desde`} value={h.desde} onChange={(e) => updateHorario(i, { desde: e.target.value })} className="rounded-lg border border-black/20 px-2 py-1.5 outline-none focus:border-blue" />
                              <span>a</span>
                              <input type="time" aria-label={`${DIAS[i]} hasta`} value={h.hasta} onChange={(e) => updateHorario(i, { hasta: e.target.value })} className="rounded-lg border border-black/20 px-2 py-1.5 outline-none focus:border-blue" />
                            </div>
                          ) : (
                            <span className="text-sm text-black/45">No atiendo</span>
                          )}
                        </div>
                      ))}
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="font-display text-lg font-bold">
                        Certificaciones <span className="text-sm font-normal text-black/55">(0 o más)</span>
                      </legend>
                      {certs.map((c, i) => (
                        <div key={c.id} className="space-y-3 rounded-2xl border border-black/15 p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold">Certificación {i + 1}</span>
                            <button type="button" onClick={() => setCerts((cs) => cs.filter((x) => x.id !== c.id))} className="text-sm font-semibold text-orange hover:underline">
                              Quitar
                            </button>
                          </div>
                          <label className={label}>
                            Nombre <span className="font-normal text-black/55">(opcional)</span>
                            <input maxLength={80} value={c.nombre} onChange={(e) => updateCert(c.id, { nombre: e.target.value })} className={input} placeholder="Ej: Matrícula de gasista" />
                          </label>
                          <label className={label}>
                            Foto o archivo
                            <input
                              required
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => updateCert(c.id, { file: e.target.files?.[0] ?? null })}
                              className="mt-1.5 block w-full text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-blue file:px-4 file:py-2 file:font-semibold file:text-white"
                            />
                          </label>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setCerts((cs) => [...cs, { id: certSeq++, nombre: '', file: null }])}
                        className="rounded-full border-2 border-dashed border-blue px-5 py-2.5 text-sm font-semibold text-blue transition hover:bg-blue-soft"
                      >
                        + Agregar certificación
                      </button>
                    </fieldset>
                  </>
                )}

                {error && (
                  <p role="alert" className="rounded-xl bg-orange-soft px-4 py-3 text-sm font-semibold text-orange">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  {step > 0 && (
                    <button type="button" onClick={() => go(step - 1)} className={secondary}>
                      Atrás
                    </button>
                  )}
                  <button className={`${primary} flex-1`}>
                    {step === total - 1 ? 'Crear cuenta' : 'Continuar'}
                  </button>
                </div>
              </form>
            </>
          )}

          {!done && (
            <p className="mt-8 text-sm text-black/70">
              ¿Ya tenés cuenta?{' '}
              <a href="#/login" className="font-semibold text-blue hover:underline">
                Iniciar sesión
              </a>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
