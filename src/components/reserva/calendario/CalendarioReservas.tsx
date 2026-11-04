import { useEffect, useMemo, useRef } from "react";

/* ----------------------------- Tipos ----------------------------- */

export type EventType = "Reserva" | "Continuidade" | "Indisponibilidade";

export interface CalendarResource {
  id: string;
  title: string;
  image?: string;
}

export interface CalendarEvent {
  id: string;
  resourceId: string;
  /** ISO. Sem offset (ex.: "2026-10-28T14:00") é interpretado em America/Sao_Paulo */
  start: string;
  end: string;
  title?: string;
  tipo: EventType;
  hospedes?: number;
  obs?: string;
  /** cor de fundo; se omitida, usa a cor padrão do tipo */
  color?: string;
}

export interface CalendarioReservaProps {
  resources: CalendarResource[];
  events: CalendarEvent[];
  /** "YYYY-MM-DD". O calendário mostra o mês inteiro desta data. Padrão: hoje */
  initialDate?: string;
  onEventClick?: (event: CalendarEvent) => void;
}

/* --------------------------- Constantes --------------------------- */

const TZ = "America/Sao_Paulo";
const TZ_OFFSET = "-03:00"; // Brasil não tem horário de verão desde 2019
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_WIDTH = 60; // px por dia (slotMinWidth)
const RESOURCE_WIDTH = 140; // px da coluna "Acomodações"
const ROW_HEIGHT = 64; // px por linha

const DEFAULT_COLORS: Record<EventType, string> = {
  Reserva: "#2563eb",
  Continuidade: "#30C46D",
  Indisponibilidade: "#303030",
};

/* ----------------------------- Helpers ----------------------------- */

/** Converte string ISO em Date, assumindo America/Sao_Paulo quando não há offset */
function parseSP(value: string): number {
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(value)) return Date.parse(value);
  if (value.length === 10) return Date.parse(`${value}T00:00:00${TZ_OFFSET}`);
  return Date.parse(`${value}${TZ_OFFSET}`);
}

function todaySP(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/* ------------------------------ Ícones ------------------------------ */

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
  </svg>
);

const BlockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 fill-current"
    aria-hidden
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 6.3 12.9L7.1 5.7A7.97 7.97 0 0 1 12 4ZM5.7 7.1l11.2 11.2A8 8 0 0 1 5.7 7.1Z" />
  </svg>
);

const PlusCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 fill-current"
    aria-hidden
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z" />
  </svg>
);

/* ---------------------------- Componente ---------------------------- */

export default function CalendarioReserva({
  resources,
  events,
  initialDate,
  onEventClick,
}: CalendarioReservaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { monthStart, daysInMonth, monthLabel, days } = useMemo(() => {
    const [y, m] = (initialDate ?? todaySP()).split("-").map(Number);
    const monthStart = Date.parse(
      `${y}-${String(m).padStart(2, "0")}-01T00:00:00${TZ_OFFSET}`,
    );
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

    const weekdayFmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      weekday: "short",
    });
    const dayFmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      day: "2-digit",
    });
    const monthFmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      month: "long",
      year: "numeric",
    });

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const noon = new Date(monthStart + i * DAY_MS + 12 * 60 * 60 * 1000);
      return {
        weekday: weekdayFmt.format(noon).replace(".", ""),
        day: dayFmt.format(noon),
      };
    });

    return {
      monthStart,
      daysInMonth,
      monthLabel: monthFmt.format(new Date(monthStart + DAY_MS / 2)),
      days,
    };
  }, [initialDate]);

  const totalWidth = daysInMonth * DAY_WIDTH;
  const monthEnd = monthStart + daysInMonth * DAY_MS;

  const now = Date.now();
  const nowInRange = now >= monthStart && now < monthEnd;
  const nowPx = ((now - monthStart) / DAY_MS) * DAY_WIDTH;
  const todayIndex = nowInRange ? Math.floor((now - monthStart) / DAY_MS) : -1;

  // Rola até o dia de hoje ao montar / trocar de mês
  useEffect(() => {
    if (todayIndex >= 0 && scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(
        0,
        todayIndex * DAY_WIDTH - 2 * DAY_WIDTH,
      );
    }
  }, [todayIndex, monthStart]);

  // Pré-calcula posição de cada evento: left/width em px conforme data e hora
  const eventsByResource = useMemo(() => {
    const map = new Map<
      string,
      { event: CalendarEvent; left: number; width: number }[]
    >();
    for (const event of events) {
      const s = parseSP(event.start);
      const e = parseSP(event.end);
      if (
        Number.isNaN(s) ||
        Number.isNaN(e) ||
        e <= monthStart ||
        s >= monthEnd
      )
        continue;

      const left = Math.max(0, ((s - monthStart) / DAY_MS) * DAY_WIDTH);
      const right = Math.min(
        totalWidth,
        ((e - monthStart) / DAY_MS) * DAY_WIDTH,
      );
      const width = Math.max(right - left, 24);

      const list = map.get(event.resourceId) ?? [];
      list.push({ event, left, width });
      map.set(event.resourceId, list);
    }
    return map;
  }, [events, monthStart, monthEnd, totalWidth]);

  const gridLines = {
    backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${DAY_WIDTH - 1}px, #e7e9eb ${DAY_WIDTH - 1}px, #e7e9eb ${DAY_WIDTH}px)`,
  };

  return (
    <div
      ref={scrollRef}
      className="h-full min-h-60 w-full overflow-auto bg-white font-sans text-gray-800
        [scrollbar-color:#cfdef9_#ffffff] scrollbar-auto
        [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar]:w-4
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px]
        [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-white
        [&::-webkit-scrollbar-thumb]:bg-[#cfdef9]"
    >
      <div className="relative" style={{ width: RESOURCE_WIDTH + totalWidth }}>
        {/* ------------------------- Cabeçalho ------------------------- */}
        <div className="sticky top-0 z-3 flex bg-[#fafbfd]">
          <div
            className="sticky left-0 z-3 flex shrink-0 items-center border-b border-r border-[#e7e9eb] bg-[#fafbfd] pl-3 text-sm font-medium uppercase text-[#747474]"
            style={{ width: RESOURCE_WIDTH }}
          >
            Acomodações
          </div>

          <div style={{ width: totalWidth }}>
            <div className="h-9 border-b border-[#e7e9eb]">
              <span className="sticky left-1/2 inline-block px-3 text-[13px] font-medium leading-9 text-[#747474] uppercase">
                {monthLabel}
              </span>
            </div>

            <div className="flex border-b border-[#e7e9eb]">
              {days.map((d, i) => (
                <div
                  key={i}
                  className={`shrink-0 whitespace-pre-line border-r border-[#e7e9eb] py-2 text-center text-[13px] uppercase leading-tight text-[#747474] ${
                    i === todayIndex ? "bg-[rgba(49,234,114,0.2)]" : ""
                  }`}
                  style={{ width: DAY_WIDTH }}
                >
                  {`${d.weekday}\n${d.day}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --------------------------- Linhas --------------------------- */}
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex"
            style={{ height: ROW_HEIGHT }}
          >
            {/* Coluna da acomodação (fixa à esquerda) */}
            <div
              className="sticky left-0 z-2 flex shrink-0 items-center gap-[8%] border-b border-r border-[#e7e9eb] bg-white px-3 shadow-[15px_0_18px_12px_rgba(0,0,0,0.02)]"
              style={{ width: RESOURCE_WIDTH }}
            >
              {resource.image ? (
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF2FF] text-sm font-semibold text-[#5b7bb5]">
                  {resource.title.charAt(0)}
                </div>
              )}
              <span
                className="truncate text-[13px] font-medium"
                title={resource.title}
              >
                {resource.title}
              </span>
            </div>

            {/* Linha do tempo */}
            <div
              className="relative shrink-0 border-b border-[#e7e9eb]"
              style={{ width: totalWidth, ...gridLines }}
            >
              {todayIndex >= 0 && (
                <div
                  className="absolute inset-y-0 border-x-2 border-[rgb(49,234,114)] bg-[rgba(49,234,114,0.2)]"
                  style={{ left: todayIndex * DAY_WIDTH, width: DAY_WIDTH }}
                />
              )}

              {nowInRange && (
                <div
                  className="pointer-events-none absolute inset-y-0 z-1 w-0.5 bg-red-500"
                  style={{ left: nowPx }}
                />
              )}

              {(eventsByResource.get(resource.id) ?? []).map(
                ({ event, left, width }) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    left={left}
                    width={width}
                    onClick={onEventClick}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Evento ----------------------------- */

function EventBlock({
  event,
  left,
  width,
  onClick,
}: {
  event: CalendarEvent;
  left: number;
  width: number;
  onClick?: (event: CalendarEvent) => void;
}) {
  const bg = event.color ?? DEFAULT_COLORS[event.tipo];
  console.log(bg, event.tipo)
  const isBlock = event.tipo === "Indisponibilidade";

  const shape = "top-1/2 h-8 -translate-y-1/2 rounded-full hover:scale-105";

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      title={event.title ?? event.obs ?? event.tipo}
      className={`absolute z-1 flex cursor-pointer items-center overflow-hidden px-3 text-xs font-medium text-white transition-transform duration-200 ${shape}`}
      style={{ left, width, backgroundColor: bg }}
    >
      {event.tipo === "Continuidade" && (
        <>
          {/* losango à esquerda, como no original */}
          <span
            aria-hidden
            className="absolute -left-2 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 rounded-sm"
            style={{ backgroundColor: bg }}
          />
          <span className="relative flex items-center gap-1.5">
            <PlusCircleIcon />
            <span className="truncate">Continuidade</span>
          </span>
        </>
      )}

      {isBlock && (
        <span className="flex items-center gap-2">
          <BlockIcon />
          <span className="truncate">{event.obs}</span>
        </span>
      )}

      {event.tipo === "Reserva" && (
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">{event.title}</span>
          <span className="flex shrink-0 items-center text-[13px]">
            <PersonIcon />
            {event.hospedes}
          </span>
        </span>
      )}
    </button>
  );
}

/* ------------------------------ Exemplo ------------------------------

<div className="h-screen">
  <CalendarioReserva
    initialDate="2026-10-01"
    resources={[{ id: "1", title: "Apto 101", image: "/img/101.jpg" }]}
    events={[
      { id: "a", resourceId: "1", tipo: "Reserva", title: "Maria Silva", hospedes: 3,
        start: "2026-10-12T14:00:00", end: "2026-10-15T11:00:00" },
      { id: "b", resourceId: "1", tipo: "Indisponibilidade", obs: "Manutenção",
        start: "2026-10-20T00:00:00", end: "2026-10-22T00:00:00" },
    ]}
    onEventClick={(e) => (e)}
  />
</div>

---------------------------------------------------------------------- */
