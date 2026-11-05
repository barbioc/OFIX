import { useEffect, useRef, useState } from 'react'

type Oficio = 'gasista' | 'electricista' | 'plomero'
type View = 'inicio' | 'chats' | 'pedidos' | 'perfil' | 'config'

const SERVICIOS: Record<Oficio, { ico: string; hov: string; label: string; plural: string; card: string; chip: string; icon: string }> = {
  gasista: {
    ico: 'text-slate-500', hov: 'hover:border-slate-400 hover:bg-slate-100',
    label: 'Gasista', plural: 'Gasistas',
    card: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
    chip: 'bg-slate-200 text-slate-800',
    icon: 'M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z',
  },
  plomero: {
    ico: 'text-sky-500', hov: 'hover:border-sky-300 hover:bg-sky-50',
    label: 'Plomero', plural: 'Plomeros',
    card: 'bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200',
    chip: 'bg-sky-100 text-sky-800',
    icon: 'M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  },
  electricista: {
    ico: 'text-amber-500', hov: 'hover:border-amber-300 hover:bg-amber-50',
    label: 'Electricista', plural: 'Electricistas',
    card: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
    chip: 'bg-amber-100 text-amber-900',
    icon: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  },
}
const OFICIOS = Object.keys(SERVICIOS) as Oficio[]

const DIRECCIONES = [
  { id: 1, alias: 'Casa', linea: 'Av. Belgrano 1450, 3° B', ciudad: 'San Miguel de Tucumán' },
  { id: 2, alias: 'Casa de mis padres', linea: 'Calle Laprida 880', ciudad: 'Yerba Buena' },
]

type Pro = { id: number; nombre: string; oficios: Oficio[]; rating: number; trabajos: number; km: number; exp: number; hace: string }
const PROS: Pro[] = [
  { id: 1, nombre: 'Matías Ferreyra', oficios: ['gasista', 'plomero'], rating: 4.8, trabajos: 37, km: 2.1, exp: 8, hace: 'Hace 2 días' },
  { id: 2, nombre: 'Carla Benítez', oficios: ['electricista'], rating: 4.9, trabajos: 62, km: 3.5, exp: 12, hace: 'Hace 3 días' },
  { id: 3, nombre: 'Diego Sánchez', oficios: ['plomero'], rating: 4.6, trabajos: 28, km: 5.0, exp: 5, hace: 'Hace 5 días' },
  { id: 4, nombre: 'Rubén Acosta', oficios: ['gasista', 'electricista'], rating: 4.7, trabajos: 45, km: 6.8, exp: 15, hace: 'Hace 1 semana' },
  { id: 5, nombre: 'Natalia Gómez', oficios: ['electricista'], rating: 4.5, trabajos: 19, km: 8.2, exp: 4, hace: 'Hace 1 semana' },
  { id: 6, nombre: 'Esteban Luna', oficios: ['plomero', 'gasista'], rating: 4.4, trabajos: 33, km: 11.0, exp: 9, hace: 'Hace 2 semanas' },
]

type Pedido = { id: number; titulo: string; oficio: Oficio; direccion: string; estado: string }

const paths: Record<string, string> = {
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4l2-2zM10 21h4',
  chev: 'M6 9l6 6 6-6',
  x: 'M6 6l12 12M18 6L6 18',
  pin: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
}
function Icon({ d, className = 'size-5', fill = false }: { d: string; className?: string; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={fill ? 0.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  )
}
const ServiceIcon = ({ o, className }: { o: Oficio; className?: string }) => <Icon d={SERVICIOS[o].icon} fill className={className} />

function Avatar({ nombre, className = 'size-9' }: { nombre: string; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-blue font-display text-sm font-bold text-white ${className}`}>
      {nombre.split(' ').map((p) => p[0]).slice(0, 2).join('')}
    </span>
  )
}
const Stars = ({ v }: { v: number }) => (
  <span className="text-orange" aria-label={`${v} de 5`}>
    {'★'.repeat(Math.round(v))}
    <span className="text-black/20">{'★'.repeat(5 - Math.round(v))}</span>
  </span>
)

let pendingQuery = ''
const USER = 'Marina Duarte'
const field = 'mt-1.5 w-full rounded-xl border border-black/20 bg-white px-4 py-3 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30'

export default function ClientApp({ catalog = false }: { catalog?: boolean }) {
  const [view, setView] = useState<View>('inicio')
  const [menu, setMenu] = useState(false)
  const [notif, setNotif] = useState(false)
  const [nuevo, setNuevo] = useState<Oficio | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1, titulo: 'Cambio de canilla de la cocina', oficio: 'plomero', direccion: 'Av. Belgrano 1450, 3° B', estado: 'Completado' },
  ])
  const [toast, setToast] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setView('inicio'), [catalog])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false)
        setNotif(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = (v: View) => {
    setView(v)
    setMenu(false)
    if (catalog) window.location.hash = '#/cliente'
    window.scrollTo(0, 0)
  }

  const linkCls = (on: boolean) => `border-b-2 px-2 py-1.5 text-sm font-semibold transition sm:px-3 ${on ? 'border-blue text-blue' : 'border-transparent text-black/70 hover:text-ink'}`
  const showing = catalog ? 'catalogo' : view

  return (
    <div className="min-h-screen bg-[#f6f7fa] text-ink">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
        <div ref={menuRef} className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8">
          <a href="#/cliente" onClick={() => setView('inicio')} aria-label="Ofix, ir al inicio" className="font-display text-2xl font-extrabold">
            ofix<span className="text-orange">.</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
            <button onClick={() => go('pedidos')} aria-current={showing === 'pedidos' ? 'page' : undefined} className={linkCls(showing === 'pedidos')}>Pedidos</button>
            <button onClick={() => go('chats')} aria-current={showing === 'chats' ? 'page' : undefined} className={linkCls(showing === 'chats')}>
              <span className="inline-flex items-center gap-1.5">
                Chats
                <span role="img" aria-label="1 mensaje sin leer" className="size-2 rounded-full bg-orange" />
              </span>
            </button>
            <span aria-hidden className="mx-1 h-6 w-px bg-[#E2E8F0] sm:mx-3" />
            <div className="relative">
              <button
                onClick={() => { setNotif((v) => !v); setMenu(false) }}
                aria-expanded={notif}
                aria-label="Notificaciones"
                className="relative rounded-full border border-black/20 p-2.5 transition hover:border-blue hover:text-blue"
              >
                <Icon d={paths.bell} />
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-orange px-1 text-[11px] font-bold text-white">1</span>
              </button>
              {notif && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                  <div className="border-b border-black/10 px-4 py-3 font-display font-bold">Notificaciones</div>
                  <button onClick={() => go('chats')} className="block w-full px-4 py-3 text-left transition hover:bg-blue-soft">
                    <span className="block text-sm font-semibold">Matías Ferreyra aceptó tu pedido</span>
                    <span className="text-xs text-black/55">Hace 3 min · coordiná la visita por chat</span>
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => { setMenu((v) => !v); setNotif(false) }}
                aria-expanded={menu}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-black/15 py-1 pl-1 pr-3 transition hover:border-blue"
              >
                <Avatar nombre={USER} />
                <span className="hidden text-sm font-semibold sm:block">{USER}</span>
                <Icon d={paths.chev} className="size-4" />
              </button>
              {menu && (
                <div role="menu" className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white py-1 shadow-xl">
                  <button role="menuitem" onClick={() => go('perfil')} className="block w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-soft">Mi perfil</button>
                  <button role="menuitem" onClick={() => go('config')} className="block w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-blue-soft">Configuración</button>
                  <a role="menuitem" href="#/login" className="block border-t border-black/10 px-4 py-2.5 text-sm font-semibold text-orange hover:bg-orange-soft">Cerrar sesión</a>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {showing === 'inicio' && <Home onPick={setNuevo} />}
        {showing === 'catalogo' && <Catalog onContact={(p) => setToast(`Abrimos un chat con ${p.nombre}.`)} />}
        {showing === 'chats' && (
          <Panel title="Chats">
            <li className="flex items-center gap-3 px-5 py-4">
              <Avatar nombre="Matías Ferreyra" className="size-10" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between"><span className="font-semibold">Matías Ferreyra</span><span className="text-xs text-black/50">18:42</span></div>
                <p className="truncate text-sm text-black/60">Perfecto, mañana a las 10 llego a tu casa.</p>
              </div>
            </li>
          </Panel>
        )}
        {showing === 'pedidos' && (
          <Panel title="Pedidos">
            {pedidos.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <span className={`grid size-10 place-items-center rounded-full ${SERVICIOS[p.oficio].chip}`}><ServiceIcon o={p.oficio} className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{p.titulo}</p>
                  <p className="text-sm text-black/60">{p.direccion}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.estado === 'Completado' ? 'bg-black/5 text-black/70' : 'bg-orange-soft text-orange'}`}>{p.estado}</span>
              </li>
            ))}
          </Panel>
        )}
        {(showing === 'perfil' || showing === 'config') && (
          <form
            onSubmit={(e) => { e.preventDefault(); setToast('Cambios guardados.') }}
            className="mx-auto max-w-xl space-y-4 rounded-2xl border border-black/10 bg-white p-6"
          >
            <div className="flex items-center gap-4">
              <Avatar nombre={USER} className="size-16 text-xl" />
              <h1 className="font-display text-2xl font-extrabold">{showing === 'perfil' ? 'Mi perfil' : 'Configuración'}</h1>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Nombre<input defaultValue="Marina" className={field} /></label>
              <label className="block text-sm font-semibold">Apellido<input defaultValue="Duarte" className={field} /></label>
              <label className="block text-sm font-semibold">Teléfono<input type="tel" defaultValue="381 555 0188" className={field} /></label>
              <label className="block text-sm font-semibold">Correo<input type="email" defaultValue="marina@ejemplo.com" className={field} /></label>
            </div>
            <button className="rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-ink">Guardar cambios</button>
          </form>
        )}
      </main>

      {nuevo && (
        <NuevaSolicitud
          inicial={nuevo}
          onClose={() => setNuevo(null)}
          onSend={(p) => {
            setPedidos((ps) => [{ ...p, id: Date.now(), estado: 'Buscando profesional' }, ...ps])
            setNuevo(null)
            setToast('Solicitud enviada. Estamos buscando al mejor profesional cerca tuyo.')
          }}
        />
      )}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white shadow-lg">{toast}</div>
      )}
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <ul className="mt-5 divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/10 bg-white">{children}</ul>
    </section>
  )
}

function ProCard({ p, tag, onOpen, cta = 'Ver perfil' }: { p: Pro; tag: string; onOpen: () => void; cta?: string }) {
  return (
    <div
      onClick={onOpen}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-blue/40 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Avatar nombre={p.nombre} className="size-12 text-base" />
        <div className="min-w-0">
          <p className="truncate font-display font-bold leading-tight">{p.nombre}</p>
          <p className="flex items-center gap-1.5 text-sm"><Stars v={p.rating} /><span className="font-semibold">{p.rating}</span><span className="text-black/50">({p.trabajos})</span></p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.oficios.map((o) => (
          <span key={o} className={`inline-flex h-6 min-w-[6.5rem] items-center justify-center gap-1 rounded-full px-3 text-xs font-semibold ${SERVICIOS[o].chip}`}>
            <ServiceIcon o={o} className="size-3" />{SERVICIOS[o].label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-black/65">
        <span className="inline-flex items-center gap-1 font-semibold text-blue"><Icon d={paths.pin} className="size-4" />{p.km} km</span>
        <span>{p.exp} años de exp.</span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/5 pt-4">
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/60">{tag}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen() }}
          className="rounded-full border border-black/25 px-3.5 py-1.5 text-xs font-semibold transition group-hover:border-blue group-hover:bg-blue group-hover:text-white"
        >
          {cta} →
        </button>
      </div>
    </div>
  )
}

function Home({ onPick }: { onPick: (o: Oficio) => void }) {
  const [q, setQ] = useState('')
  return (
    <>
      <section className="text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">¿Tenés una urgencia?</h1>
        <p className="mx-auto mt-3 max-w-lg text-black/65">Elegí el tipo de profesional y publicá tu pedido. Lo enviamos al mejor profesional disponible cerca tuyo.</p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          {OFICIOS.map((o) => (
            <button
              key={o}
              onClick={() => onPick(o)}
              className={`group flex flex-col items-center gap-3 rounded-3xl border border-black/10 bg-white px-6 py-8 font-display text-xl font-bold transition hover:-translate-y-1 hover:shadow-md ${SERVICIOS[o].hov}`}
            >
              <ServiceIcon o={o} className={`size-12 ${SERVICIOS[o].ico}`} />
              {SERVICIOS[o].label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-3xl rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-extrabold">Quiero buscar mi propio profesional, sin apuro</h2>
        <p className="mt-2 text-black/65">Mirá perfiles, calificaciones y opiniones. Después hablás con el profesional por chat para coordinar la visita cuando y como quieran.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            pendingQuery = q
            window.location.hash = '#/cliente/profesionales'
          }}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <label className="relative flex-1">
            <span className="sr-only">Buscar profesional</span>
            <Icon d={paths.search} className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscá por nombre" className="w-full rounded-full border border-black/15 bg-[#f6f7fa] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/30" />
          </label>
          <button className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink">Explorar catálogo completo</button>
        </form>
      </section>

    </>
  )
}

function Catalog({ onContact }: { onContact: (p: Pro) => void }) {
  const [f, setF] = useState<Oficio | 'todos'>('todos')
  const [q, setQ] = useState(() => {
    const v = pendingQuery
    pendingQuery = ''
    return v
  })
  const list = PROS.filter((p) => (f === 'todos' || p.oficios.includes(f)) && p.nombre.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.rating - a.rating)
  return (
    <section>
      <a href="#/cliente" className="text-sm font-semibold text-blue hover:underline">← Volver al inicio</a>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">Profesionales</h1>
      <p className="mt-2 text-black/65">Elegí con quién trabajar y coordiná todo por chat.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative">
          <span className="sr-only">Buscar por nombre</span>
          <Icon d={paths.search} className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre" className="rounded-full border border-black/20 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por oficio">
          {(['todos', ...OFICIOS] as const).map((o) => (
            <button
              key={o}
              onClick={() => setF(o)}
              aria-pressed={f === o}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${f === o ? 'border-blue bg-blue text-white' : 'border-black/15 bg-white hover:border-black/40'}`}
            >
              {o === 'todos' ? 'Todos' : SERVICIOS[o].plural}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProCard key={p.id} p={p} tag={`${p.trabajos} trabajos`} onOpen={() => onContact(p)} cta="Contactar" />
        ))}
      </div>
      {list.length === 0 && <p className="mt-10 text-center text-black/55">No encontramos profesionales con esos filtros.</p>}
    </section>
  )
}

function NuevaSolicitud({ inicial, onClose, onSend }: { inicial: Oficio; onClose: () => void; onSend: (p: { titulo: string; oficio: Oficio; direccion: string }) => void }) {
  const [oficio, setOficio] = useState<Oficio>(inicial)
  const [titulo, setTitulo] = useState('')
  const [desc, setDesc] = useState('')
  const [dir, setDir] = useState<number | null>(DIRECCIONES[0].id)
  const [files, setFiles] = useState<{ file: File; url: string }[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.url)), []) // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((cur) => [...cur, ...Array.from(list).map((file) => ({ file, url: URL.createObjectURL(file) }))])
  }
  const removeFile = (i: number) =>
    setFiles((cur) => {
      URL.revokeObjectURL(cur[i].url)
      return cur.filter((_, j) => j !== i)
    })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const d = DIRECCIONES.find((x) => x.id === dir)
    if (!d) return setError('Elegí la dirección donde necesitás el trabajo.')
    onSend({ titulo, oficio, direccion: d.linea })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Nueva solicitud de trabajo">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={submit} className="relative max-h-[94vh] w-full max-w-xl overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-black/5"><Icon d={paths.x} /></button>
        <h2 className="pr-8 font-display text-3xl font-extrabold">Nueva solicitud de trabajo</h2>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Servicio</legend>
          <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
            {OFICIOS.map((o) => (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={oficio === o}
                onClick={() => setOficio(o)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition ${oficio === o ? SERVICIOS[o].card.split(' ').slice(0, 3).join(' ') + ' ring-2 ring-ink/70' : 'border-black/15 hover:border-black/40'}`}
              >
                <ServiceIcon o={o} className="size-4" />{SERVICIOS[o].label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold">
            Título
            <input required maxLength={80} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Pérdida de agua en el baño" className={field} />
          </label>
          <label className="block text-sm font-semibold">
            Descripción detallada
            <textarea required rows={4} maxLength={1000} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Contanos qué pasó, desde cuándo y qué ya probaste" className={field} />
          </label>

          <div>
            <p className="text-sm font-semibold">Fotos y videos <span className="font-normal text-black/55">(opcional)</span></p>
            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/25 px-4 py-4 text-sm font-semibold text-blue transition hover:bg-blue-soft">
              <Icon d={paths.upload} className="size-5" />
              Subir fotos o videos
              <input type="file" multiple accept="image/*,video/*" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 grid grid-cols-4 gap-2">
                {files.map((f, i) => (
                  <li key={f.url} className="relative aspect-square overflow-hidden rounded-xl bg-black/5">
                    {f.file.type.startsWith('video') ? <video src={f.url} muted className="size-full object-cover" /> : <img src={f.url} alt={f.file.name} className="size-full object-cover" />}
                    <button type="button" onClick={() => removeFile(i)} aria-label={`Quitar ${f.file.name}`} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink/80 text-white"><Icon d={paths.x} className="size-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">Dirección del trabajo</legend>
            <div className="mt-2 space-y-2" role="radiogroup">
              {DIRECCIONES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={dir === d.id}
                  onClick={() => { setDir(d.id); setError('') }}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${dir === d.id ? 'border-blue bg-blue-soft' : 'border-black/15 hover:border-black/40'}`}
                >
                  <Icon d={paths.pin} className={`size-5 shrink-0 ${dir === d.id ? 'text-blue' : ''}`} />
                  <span>
                    <span className="block text-sm font-bold">{d.alias}</span>
                    <span className="block text-sm text-black/65">{d.linea}, {d.ciudad}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-orange-soft px-4 py-3 text-sm font-semibold text-orange">{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onClose} className="rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:border-blue hover:text-blue">Cancelar</button>
          <button className="flex-1 rounded-full bg-orange px-6 py-3 font-semibold text-white transition hover:bg-ink">Encontrar profesional ahora</button>
        </div>
      </form>
    </div>
  )
}
