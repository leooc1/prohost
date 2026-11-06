import {
  BanknoteArrowUp,
  BanknoteCheck,
  CalendarCheck2,
  CalendarPlus,
  House,
  MessagesCircle,
  Moon,
  Scissors,
  UserRound,
} from "lucide-react";
import type React from "react";
import { countDiaria } from "../../../../utils";
interface Reserva {
  id: number;
  acomodacao: { id: number; nome: string };
  canalReserva?: { id: number; nome: string };
  hospede?: { id: number; nome: string };
  qtdHospede?: number;
  checkIn: string;
  checkOut: string;
  tipoReserva: "Reserva" | "Indisponibilidade" | "Continuidade";
  valor?: number;
  valorLiq?: number;
  comissaoOta?: number;
  obs?: string | null;
}

interface LayoutProps {
  tipoReserva: "Reserva" | "Indisponibilidade" | "Continuidade";
  reserva: Reserva;
}

interface GridIconProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  span?: string;
}

function GridIcon(props: GridIconProps) {
  return (
    <div
      className={`flex min-w-0 items-center rounded-box border border-blue-800 px-2 py-1 ${props.span}`}
    >
      <span className="shrink-0 pr-2 text-blue-800 text-sm">{props.icon}</span>
      <div className="flex min-w-0 flex-1 flex-col text-sm">
        <p className="truncate font-semibold text-blue-800">{props.title}</p>
        <p className="truncate">{props.value}</p>
      </div>
    </div>
  );
}

export default function Layout(props: LayoutProps) {
  if (props.tipoReserva === "Reserva")
    return <Reserva reserva={props.reserva} />;
  else if (props.tipoReserva === "Continuidade")
    return <Continuidade reserva={props.reserva} />;
  else if (props.tipoReserva === "Indisponibilidade")
    return <Indisponibilidade reserva={props.reserva} />;
}

function Reserva(props: { reserva: Reserva }) {
  console.log(props.reserva);
  return (
    <div className="w-full grid gap-2">
      <div className="grid min-w-0">
        <GridIcon
          icon={<UserRound className="size-6" />}
          title="Hóspede"
          value={props.reserva.hospede?.nome ?? ""}
        />
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <GridIcon
          icon={<CalendarPlus className="size-6" />}
          title="Chegada"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkIn))}
        />
        <GridIcon
          icon={<CalendarCheck2 className="size-6" />}
          title="Partida"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkOut))}
        />
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        <GridIcon
          span="col-span-2"
          icon={<House className="size-6" />}
          title="Acomodação"
          value={props.reserva.acomodacao.nome}
        />
        <GridIcon
          icon={<Moon className="size-6" />}
          title="Noites"
          value={countDiaria(
            props.reserva.checkIn,
            props.reserva.checkOut,
          ).toString()}
        />
      </div>
      <div className="grid min-w-0">
        <GridIcon
          icon={<BanknoteArrowUp className="size-6" />}
          title="Valor Total"
          value={
            "R$ " +
            new Intl.NumberFormat("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(props.reserva.valor ?? 0)
          }
        />
      </div>
      <div className="grid min-w-0">
        <GridIcon
          icon={<Scissors className="size-6" />}
          title="Comissão"
          value={
            "R$ " +
            new Intl.NumberFormat("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(props.reserva.comissaoOta ?? 0)
          }
        />
      </div>
      <div className="grid min-w-0">
        <GridIcon
          icon={<BanknoteCheck className="size-6" />}
          title="Valor Líquido"
          value={
            "R$ " +
            new Intl.NumberFormat("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(props.reserva.valorLiq ?? 0)
          }
        />
      </div>
    </div>
  );
}

function Continuidade(props: { reserva: Reserva }) {
  return (
    <div className="w-full grid gap-2">
      <div className="grid min-w-0">
        <GridIcon
          icon={<UserRound className="size-6" />}
          title="Hóspede"
          value={props.reserva.hospede?.nome ?? ""}
        />
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <GridIcon
          icon={<CalendarPlus className="size-6" />}
          title="Chegada"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkIn))}
        />
        <GridIcon
          icon={<CalendarCheck2 className="size-6" />}
          title="Partida"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkOut))}
        />
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        <GridIcon
          span="col-span-2"
          icon={<House className="size-6" />}
          title="Acomodação"
          value={props.reserva.acomodacao.nome}
        />
        <GridIcon
          icon={<Moon className="size-6" />}
          title="Noites"
          value={countDiaria(
            props.reserva.checkIn,
            props.reserva.checkOut,
          ).toString()}
        />
      </div>
      <div className="grid min-w-0">
        <GridIcon
          icon={<BanknoteCheck className="size-6" />}
          title="Valor"
          value={
            "R$ " +
            new Intl.NumberFormat("pt-BR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(props.reserva.valorLiq ?? 0)
          }
        />
      </div>
    </div>
  );
}

function Indisponibilidade(props: { reserva: Reserva }) {
  console.log(props);
  return (
    <div className="w-full grid gap-2">
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <GridIcon
          icon={<CalendarPlus className="size-6" />}
          title="De"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkIn))}
        />
        <GridIcon
          icon={<CalendarCheck2 className="size-6" />}
          title="Até"
          value={new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            timeStyle: "short",
            dateStyle: "short",
          }).format(new Date(props.reserva.checkOut))}
        />
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        <GridIcon
          span="col-span-2"
          icon={<House className="size-6" />}
          title="Acomodação"
          value={props.reserva.acomodacao.nome}
        />
        <GridIcon
          icon={<Moon className="size-6" />}
          title="Noites"
          value={countDiaria(
            props.reserva.checkIn,
            props.reserva.checkOut,
          ).toString()}
        />
      </div>
      <div className="grid min-w-0">
        <GridIcon
          icon={<MessagesCircle className="size-6" />}
          title="Motivo"
          value={props.reserva.obs ?? ""}
        />
      </div>
    </div>
  );
}
