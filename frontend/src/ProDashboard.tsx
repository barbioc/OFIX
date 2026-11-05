import { useEffect, useMemo, useState } from 'react'

type View = 'inicio' | 'perfil' | 'chats' | 'config' | 'historial'
type Oficio = 'Gasista' | 'Electricista' | 'Plomero'

type Job = {
  id: number
  titulo: string
  descripcion: string
  detalle: string
  oficio: Oficio
  urgente: boolean
  distanciaKm: number
  direccion: string
  ciudad: string
  cliente: string
  clienteRating: number
  fechaPreferida: string
  publicado: string
  venceMin?: number
}

// Datos de ejemplo: todavía no hay backend.
const OFERTAS_INICIALES: Job[] = [
  {
    id: 1, titulo: 'Pérdida de gas en la cocina', oficio: 'Gasista', urgente: true, distanciaKm: 1.8,
    descripcion: 'Olor a gas cerca de la hornalla, cerré la llave de paso.',
    detalle: 'Desde ayer a la noche se siente olor a gas cuando la cocina está apagada. Cerré la llave de paso general. Es un departamento con calefón y cocina a gas natural. Necesito que alguien venga cuanto antes a revisar las conexiones.',
    direccion: 'Av. Belgrano 1450, 3° B', ciudad: 'San Miguel de Tucumán', cliente: 'Marina Duarte', clienteRating: 4.8,
    fechaPreferida: 'Lo antes posible', publicado: 'Hace 4 min', venceMin: 26,
  },
  {
    id: 2, titulo: 'Cortocircuito en el tablero', oficio: 'Electricista', urgente: true, distanciaKm: 4.2,
    descripcion: 'Salta la térmica al encender el aire acondicionado.',
    detalle: 'Cada vez que prendo el aire acondicionado salta la térmica y se corta la luz de media casa. Ya probé con otro enchufe y pasa lo mismo. Casa de un piso, tablero con 4 térmicas.',
    direccion: 'Calle Laprida 880', ciudad: 'Yerba Buena', cliente: 'Julián Paz', clienteRating: 4.5,
    fechaPreferida: 'Hoy', publicado: 'Hace 11 min', venceMin: 19,
  },
  {
    id: 3, titulo: 'Instalación de termotanque', oficio: 'Plomero', urgente: false, distanciaKm: 6.5,
    descripcion: 'Colocar un termotanque eléctrico de 80 litros ya comprado.',
    detalle: 'Compré un termotanque eléctrico de 80 L y necesito instalarlo en el lavadero, reemplazando uno viejo. Hay que desconectar el anterior, llevarlo y conectar agua fría y caliente. La instalación eléctrica ya está lista.',
    direccion: 'Pasaje Los Nogales 215', ciudad: 'San Miguel de Tucumán', cliente: 'Carolina Ríos', clienteRating: 5,
    fechaPreferida: 'Sábado por la mañana', publicado: 'Hace 2 h',
  },
  {
    id: 4, titulo: 'Cambio de canilla de la cocina', oficio: 'Plomero', urgente: false, distanciaKm: 9.1,
    descripcion: 'La canilla pierde por la base y gotea sin parar.',
    detalle: 'La mezcladora de la cocina pierde por la base y gotea todo el día. Tengo la canilla nueva para colocar. Es una bacha simple con mesada de granito.',
    direccion: 'Av. Perón 2300', ciudad: 'Banda del Río Salí', cliente: 'Hernán Soria', clienteRating: 4.2,
    fechaPreferida: 'Esta semana', publicado: 'Hace 5 h',
  },
]

const PENDIENTES_INICIALES: Job[] = [
  {
    id: 90, titulo: 'Revisión de instalación de gas', oficio: 'Gasista', urgente: false, distanciaKm: 3.4,
    descripcion: 'Revisión previa a la compra de un departamento.',
    detalle: 'Necesito una revisión completa de la instalación de gas de un departamento antes de cerrar la compra.',
    direccion: 'Calle Mendoza 640, 2° A', ciudad: 'San Miguel de Tucumán', cliente: 'Lucía Medina', clienteRating: 4.9,
    fechaPreferida: 'Mañana, 10:00', publicado: 'Aceptado ayer',
  },
]

const HISTORIAL_INICIAL = [
  { id: 1, titulo: 'Cambio de llave térmica', cliente: 'Santiago Vera', fecha: '12 may 2025', rating: 5 },
  { id: 2, titulo: 'Destape de cañería', cliente: 'Paula Ledesma', fecha: '3 may 2025', rating: 4 },
  { id: 3, titulo: 'Instalación de cocina a gas', cliente: 'Rodrigo Aguirre', fecha: '28 abr 2025', rating: 5 },
]

const OPINIONES = [
  { id: 1, autor: 'Santiago Vera', rating: 5, texto: 'Muy puntual y prolijo. Explicó todo lo que hizo y dejó limpio.', fecha: '12 may 2025' },
  { id: 2, autor: 'Paula Ledesma', rating: 4, texto: 'Resolvió el problema rápido. Recomendable.', fecha: '3 may 2025' },
  { id: 3, autor: 'Rodrigo Aguirre', rating: 5, texto: 'Excelente profesional, el precio fue el acordado.', fecha: '28 abr 2025' },
]

const CHATS = [
  { id: 1, nombre: 'Lucía Medina', ultimo: 'Perfecto, mañana a las 10 te espero.', hora: '18:42' },
  { id: 2, nombre: 'Santiago Vera', ultimo: 'Muchas gracias por todo.', hora: 'Ayer' },
]

const RUBRO: Record<Oficio, string> = { Gasista: 'Gas', Electricista: 'Electricidad', Plomero: 'Plomería' }
const NO_LEIDOS = 2

const PERFIL = { nombre: 'Matías Ferreyra', oficios: ['Gasista', 'Plomero'], rating: 4.8, trabajos: 37 }

// Horario de atención de ejemplo (lo que se cargó al registrarse): lunes a viernes, 8 a 18.
const enHorario = (d = new Date()) => {
  const dia = d.getDay()
  const h = d.getHours() + d.getMinutes() / 60
  return dia >= 1 && dia <= 5 && h >= 8 && h < 18
}

const iconPaths: Record<string, string> = {
  inicio: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  perfil: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  chats: 'M4 5h16v11H9l-5 4V5z',
  config: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-2-4-2 1a7 7 0 00-2-1l-1-2h-4l-1 2a7 7 0 00-2 1L5 7l-2 4 2 1v2l-2 1 2 4 2-1a7 7 0 002 1l1 2h4l1-2a7 7 0 002-1l2 1 2-4-2-1v-2z',
  historial: 'M12 7v5l3 2M4 12a8 8 0 108-8 8 8 0 00-6 3M4 4v4h4',
  salir: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9',
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4l2-2zM10 21h4',
  pin: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  x: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M5 12l5 5 9-10',
  clock: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z',
}
function Icon({ n, className = 'size-5' }: { n: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={iconPaths[n]} />
    </svg>
  )
}

function Avatar({ nombre, className = 'size-10' }: { nombre: string; className?: string }) {
  const ini = nombre.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-blue font-display text-sm font-bold text-white ${className}`}>{ini}</span>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="text-orange" aria-label={`${value} de 5 estrellas`}>
      {'★'.repeat(Math.round(value))}
      <span className="text-black/20">{'★'.repeat(5 - Math.round(value))}</span>
    </span>
  )
}

const nav: { id: View; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'perfil', label: 'Mi perfil' },
  { id: 'chats', label: 'Chats' },
  { id: 'config', label: 'Configuración' },
  { id: 'historial', label: 'Historial de trabajos' },
]

export default function ProDashboard() {
  const [view, setView] = useState<View>('inicio')
  const [drawer, setDrawer] = useState(false)
  const [ofertas, setOfertas] = useState(OFERTAS_INICIALES)
  const [pendientes, setPendientes] = useState(PENDIENTES_INICIALES)
  const [historial, setHistorial] = useState(HISTORIAL_INICIAL)
  const [modo, setModo] = useState<'auto' | 'manual'>('auto')
  const [manualOn, setManualOn] = useState(false)
  const [completados, setCompletados] = useState(8) // completados este mes (ejemplo)
  const [auto, setAuto] = useState(enHorario())
  const [open, setOpen] = useState<Job | null>(null)
  const [notif, setNotif] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const t = setInterval(() => setAuto(enHorario()), 30000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const tomando = modo === 'auto' ? auto : manualOn
  const elegirModo = (m: 'auto' | 'manual') => {
    if (m === 'manual' && modo === 'auto') setManualOn(auto)
    setModo(m)
  }
  const alternar = () => {
    setManualOn(!tomando)
    setModo('manual')
  }

  // Urgentes primero; sin conexión no se reciben ofertas urgentes.
  const visibles = useMemo(
    () => [...ofertas].filter((o) => tomando || !o.urgente).sort((a, b) => Number(b.urgente) - Number(a.urgente) || a.distanciaKm - b.distanciaKm),
    [ofertas, tomando],
  )

  const aceptar = (j: Job) => {
    setOfertas((os) => os.filter((o) => o.id !== j.id))
    setPendientes((ps) => [{ ...j, publicado: 'Aceptado recién' }, ...ps])
    setOpen(null)
    setToast('Trabajo aceptado. Lo encontrás en "Trabajos pendientes".')
  }
  const rechazar = (j: Job) => {
    setOfertas((os) => os.filter((o) => o.id !== j.id))
    setOpen(null)
    setToast('Oferta rechazada.')
  }
  const completar = (j: Job) => {
    setPendientes((ps) => ps.filter((p) => p.id !== j.id))
    setHistorial((h) => [{ id: j.id + 1000, titulo: j.titulo, cliente: j.cliente, fecha: 'Hoy', rating: 0 }, ...h])
    setCompletados((c) => c + 1)
    setToast('Trabajo marcado como completado.')
  }

  const goto = (v: View) => {
    setView(v)
    setDrawer(false)
    window.scrollTo(0, 0)
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <a href="#inicio" className="px-6 pt-6 font-display text-2xl font-extrabold">
        ofix<span className="text-orange">.</span>
      </a>
      <button onClick={() => goto('perfil')} className="mx-4 mt-6 flex items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-blue-soft">
        <Avatar nombre={PERFIL.nombre} />
        <span className="min-w-0">
          <span className="block truncate font-display font-bold leading-tight">{PERFIL.nombre}</span>
          <span className="block text-xs text-black/55">Profesional</span>
        </span>
      </button>
      <nav className="mt-4 flex-1 space-y-1 px-4" aria-label="Principal">
        {nav.map((n) => {
          const on = view === n.id
          return (
            <button
              key={n.id}
              onClick={() => goto(n.id)}
              aria-current={on ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${on ? 'bg-blue text-white shadow-sm' : 'hover:bg-black/5'}`}
            >
              <Icon n={n.id} />
              <span className="flex-1 text-left">{n.label}</span>
              {n.id === 'chats' && NO_LEIDOS > 0 && (
                <span aria-label={`${NO_LEIDOS} mensajes sin leer`} className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${on ? 'bg-white text-blue' : 'bg-orange text-white'}`}>
                  {NO_LEIDOS}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-black/10 p-3">
        <a href="#/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange transition hover:bg-orange-soft">
          <Icon n="salir" />
          Cerrar sesión
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f7fa] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/10 lg:block">{sidebar}</aside>
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <button onClick={() => setDrawer(true)} className="rounded-full border border-black/20 p-2 lg:hidden" aria-label="Abrir menú">
            <Icon n="menu" />
          </button>
          <h1 className="hidden font-display text-lg font-bold lg:block">{nav.find((n) => n.id === view)?.label}</h1>
          <div className="relative">
            <button
              onClick={() => setNotif((v) => !v)}
              aria-expanded={notif}
              aria-label={`Notificaciones, ${visibles.length} ofertas`}
              className="relative rounded-full border border-black/20 p-2.5 transition hover:border-blue hover:text-blue"
            >
              <Icon n="bell" />
              {visibles.length > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-orange px-1 text-[11px] font-bold text-white">
                  {visibles.length}
                </span>
              )}
            </button>
            {notif && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                <div className="border-b border-black/10 px-4 py-3 font-display font-bold">Notificaciones</div>
                {visibles.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-black/55">No tenés ofertas nuevas.</p>
                ) : (
                  <ul className="max-h-96 divide-y divide-black/5 overflow-auto">
                    {visibles.map((o) => (
                      <li key={o.id}>
                        <button
                          onClick={() => {
                            setNotif(false)
                            setOpen(o)
                          }}
                          className="block w-full px-4 py-3 text-left transition hover:bg-blue-soft"
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold">
                            {o.urgente ? <span className="rounded-full bg-orange px-2 py-0.5 text-white">Urgente</span> : <span className="rounded-full bg-black/10 px-2 py-0.5">Nueva oferta</span>}
                            <span className="text-black/50">{o.publicado}</span>
                          </span>
                          <span className="mt-1 block text-sm font-semibold">{o.titulo}</span>
                          <span className="block text-xs text-black/55">a {o.distanciaKm} km</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </header>

        <main className={`mx-auto px-4 py-8 sm:px-8 ${view === 'inicio' ? 'max-w-6xl' : 'max-w-3xl'}`}>
          {view === 'inicio' && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0">
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={alternar}
                        role="switch"
                        aria-checked={tomando}
                        aria-label="Disponible para urgencias"
                        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${tomando ? 'bg-[#16a34a]' : 'bg-black/25'}`}
                      >
                        <span className={`absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform ${tomando ? 'translate-x-6' : ''}`} />
                      </button>
                      <div>
                        <p className="font-display text-lg font-bold leading-tight">Disponible para urgencias</p>
                        <p className="text-sm text-black/60">
                          {tomando ? 'Estás tomando trabajos.' : (
                            <span className="inline-flex items-center gap-1.5">
                              <Icon n="clock" className="size-3.5" />
                              No estás tomando trabajos: no recibís ofertas urgentes.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-black/50">Modo</p>
                      <div role="tablist" aria-label="Modo de disponibilidad" className="inline-flex rounded-full bg-black/5 p-1">
                        {([['auto', 'Automático'], ['manual', 'Manual']] as const).map(([m, l]) => (
                          <button
                            key={m}
                            role="tab"
                            aria-selected={modo === m}
                            onClick={() => elegirModo(m)}
                            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${modo === m ? 'bg-white shadow-sm' : 'text-black/55 hover:text-ink'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-black/5 pt-3 text-xs text-black/55">
                    {modo === 'auto'
                      ? 'Automático: se activa solo dentro de tu horario de atención (lun a vie, 8 a 18 h).'
                      : 'Manual: vos decidís cuándo conectarte, sin importar tu horario.'}
                  </p>
                </div>

                <section className="mt-8" aria-labelledby="ofertas">
                  <div className="flex items-baseline justify-between">
                    <h2 id="ofertas" className="font-display text-2xl font-extrabold">Ofertas de trabajo</h2>
                    <span className="text-sm text-black/55">{visibles.length} sin responder</span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {visibles.length === 0 && (
                      <li className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-black/55">
                        Por ahora no hay ofertas. Te avisaremos cuando llegue una.
                      </li>
                    )}
                    {visibles.map((o) => (
                      <li key={o.id} className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center ${o.urgente ? 'border-orange/60' : 'border-black/10'}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="rounded-full bg-blue-soft px-2.5 py-0.5 text-blue">{RUBRO[o.oficio]}</span>
                            {o.urgente ? (
                              <span className="rounded-full bg-orange px-2.5 py-0.5 text-white">Urgente · expira en {o.venceMin} min</span>
                            ) : (
                              <span className="rounded-full bg-black/8 bg-black/5 px-2.5 py-0.5 text-black/70">Solicitud del día</span>
                            )}
                          </div>
                          <h3 className="mt-2 font-display text-lg font-bold leading-snug">{o.titulo}</h3>
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-blue">
                            <Icon n="pin" className="size-4" />a {o.distanciaKm} km
                          </p>
                          <p className="mt-1.5 text-sm text-black/70">{o.descripcion}</p>
                        </div>
                        <div className="flex shrink-0 flex-row items-center gap-2 sm:w-36 sm:flex-col sm:items-stretch">
                          <button onClick={() => aceptar(o)} className="flex-1 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink">Aceptar</button>
                          <button onClick={() => rechazar(o)} className="flex-1 rounded-full border-2 border-black/25 px-5 py-2 text-sm font-semibold text-black/75 transition hover:border-ink hover:text-ink">Rechazar</button>
                          <button onClick={() => setOpen(o)} className="px-2 text-center text-sm font-semibold text-blue underline-offset-4 hover:underline">Ver detalle</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-12" aria-labelledby="pend">
                  <div className="flex items-baseline justify-between">
                    <h2 id="pend" className="font-display text-2xl font-extrabold">Trabajos pendientes</h2>
                    <span className="text-sm text-black/55">{pendientes.length} en curso</span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {pendientes.length === 0 && (
                      <li className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-black/55">
                        No tenés trabajos pendientes.
                      </li>
                    )}
                    {pendientes.map((p) => (
                      <li key={p.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-blue-soft px-2.5 py-0.5 text-blue">{RUBRO[p.oficio]}</span>
                          <span className="flex items-center gap-1 text-black/55"><Icon n="clock" className="size-3.5" />{p.fechaPreferida}</span>
                        </div>
                        <button onClick={() => setOpen(p)} className="mt-2 block w-full text-left">
                          <span className="font-display text-lg font-bold">{p.titulo}</span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-blue">
                            <Icon n="pin" className="size-4" />a {p.distanciaKm} km · {p.direccion}
                          </span>
                          <span className="mt-1.5 block text-sm text-black/70">{p.descripcion}</span>
                        </button>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button onClick={() => goto('chats')} className="flex items-center gap-2 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink">
                            <Icon n="chats" className="size-4" />
                            Ir al chat
                          </button>
                          <button onClick={() => completar(p)} className="flex items-center gap-2 rounded-full border-2 border-ink px-5 py-1.5 text-sm font-semibold transition hover:border-blue hover:text-blue">
                            <Icon n="check" className="size-4" />
                            Marcar como completado
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Resumen">
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-black/50">Reputación</h2>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-blue">{PERFIL.rating}</span>
                    <Stars value={PERFIL.rating} />
                  </p>
                  <button onClick={() => goto('perfil')} className="mt-2 text-sm font-semibold text-blue hover:underline">Ver opiniones</button>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-black/50">Este mes</h2>
                  <p className="mt-2 font-display text-4xl font-extrabold">{completados}</p>
                  <p className="text-sm text-black/60">trabajos completados</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-black/50">Horario de atención</h2>
                  <p className="mt-2 font-semibold">Lunes a viernes</p>
                  <p className="text-sm text-black/60">8:00 a 18:00 h</p>
                  <button onClick={() => goto('config')} className="mt-2 text-sm font-semibold text-blue hover:underline">Editar horario</button>
                </div>
              </aside>
            </div>
          )}

          {view === 'perfil' && (
            <section>
              <div className="flex items-center gap-5 rounded-2xl border border-black/10 bg-white p-6">
                <Avatar nombre={PERFIL.nombre} className="size-20 text-2xl" />
                <div>
                  <h2 className="font-display text-2xl font-extrabold">{PERFIL.nombre}</h2>
                  <p className="text-sm text-black/60">{PERFIL.oficios.join(' · ')}</p>
                  <p className="mt-1 flex items-center gap-2">
                    <span className="font-display text-2xl font-extrabold text-blue">{PERFIL.rating}</span>
                    <Stars value={PERFIL.rating} />
                    <span className="text-sm text-black/55">{PERFIL.trabajos} trabajos</span>
                  </p>
                </div>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold">Opiniones</h3>
              <ul className="mt-3 space-y-3">
                {OPINIONES.map((o) => (
                  <li key={o.id} className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{o.autor}</span>
                      <span className="text-xs text-black/50">{o.fecha}</span>
                    </div>
                    <Stars value={o.rating} />
                    <p className="mt-1 text-sm text-black/75">{o.texto}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {view === 'chats' && (
            <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/10 bg-white">
              {CHATS.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-5 py-4">
                  <Avatar nombre={c.nombre} />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">{c.nombre}</span>
                      <span className="text-xs text-black/50">{c.hora}</span>
                    </div>
                    <p className="truncate text-sm text-black/60">{c.ultimo}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {view === 'historial' && (
            <ul className="space-y-3">
              {historial.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-5">
                  <div>
                    <p className="font-display font-bold">{h.titulo}</p>
                    <p className="text-sm text-black/60">{h.cliente} · {h.fecha}</p>
                  </div>
                  {h.rating ? <Stars value={h.rating} /> : <span className="text-xs text-black/50">Sin calificar</span>}
                </li>
              ))}
            </ul>
          )}

          {view === 'config' && <Config setToast={setToast} />}
        </main>
      </div>

      {open && <Ficha job={open} pendiente={pendientes.some((p) => p.id === open.id)} onClose={() => setOpen(null)} onAceptar={aceptar} onRechazar={rechazar} />}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function Ficha({ job, pendiente, onClose, onAceptar, onRechazar }: { job: Job; pendiente: boolean; onClose: () => void; onAceptar: (j: Job) => void; onRechazar: (j: Job) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const row = (k: string, v: React.ReactNode) => (
    <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5 text-sm">
      <dt className="font-semibold text-black/55">{k}</dt>
      <dd>{v}</dd>
    </div>
  )
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={job.titulo}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-black/5">
          <Icon n="x" />
        </button>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {job.urgente && <span className="rounded-full bg-orange px-3 py-1 text-white">Urgente</span>}
          <span className="rounded-full bg-blue-soft px-3 py-1 text-blue">{job.oficio}</span>
        </div>
        <h2 className="mt-3 pr-8 font-display text-3xl font-extrabold leading-tight">{job.titulo}</h2>
        <p className="mt-1 text-sm text-black/55">{job.publicado}</p>
        {job.urgente && job.venceMin && !pendiente && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-orange-soft px-4 py-2.5 text-sm font-semibold text-orange">
            <Icon n="clock" className="size-4" />
            Esta oferta vence en {job.venceMin} minutos.
          </p>
        )}
        <p className="mt-5 leading-relaxed text-black/80">{job.detalle}</p>
        <dl className="mt-5 divide-y divide-black/10 border-y border-black/10">
          {row('Ubicación', <>{job.direccion}, {job.ciudad}</>)}
          {row('Distancia', <>a {job.distanciaKm} km de tu zona</>)}
          {row('Cuándo', job.fechaPreferida)}
          {row('Cliente', <>{job.cliente} · <Stars value={job.clienteRating} /> {job.clienteRating}</>)}
        </dl>
        {pendiente ? (
          <button onClick={onClose} className="mt-6 w-full rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:border-blue hover:text-blue">Cerrar</button>
        ) : (
          <div className="mt-6 flex gap-3">
            <button onClick={() => onRechazar(job)} className="flex-1 rounded-full border-2 border-ink px-6 py-3 font-semibold transition hover:border-orange hover:text-orange">Rechazar</button>
            <button onClick={() => onAceptar(job)} className="flex-1 rounded-full bg-orange px-6 py-3 font-semibold text-white transition hover:bg-ink">Aceptar trabajo</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Config({ setToast }: { setToast: (s: string) => void }) {
  const field = 'mt-1.5 w-full rounded-xl border border-black/20 bg-white px-4 py-3 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/30'
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setToast('Cambios guardados.')
      }}
      className="space-y-4 rounded-2xl border border-black/10 bg-white p-6"
    >
      <p className="text-sm text-black/60">Modificá tu información. Los cambios en identidad pueden requerir una nueva validación.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Nombre<input defaultValue="Matías" className={field} /></label>
        <label className="block text-sm font-semibold">Apellido<input defaultValue="Ferreyra" className={field} /></label>
        <label className="block text-sm font-semibold">Teléfono<input type="tel" defaultValue="381 555 0123" className={field} /></label>
        <label className="block text-sm font-semibold">Correo<input type="email" defaultValue="matias@ejemplo.com" className={field} /></label>
      </div>
      <button className="rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-ink">Guardar cambios</button>
    </form>
  )
}
