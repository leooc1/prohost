export interface ReservaEdicao {
  id: number;
  acomodacao: {
    id: number;
    nome: string;
    modeloNegocio: number;
    taxaLimpeza?: number | null;
  };
  canalReserva?: { id: number; nome: string };
  hospede?: { id: number; nome: string };
  qtdHospede?: number;
  checkIn: string;
  checkOut: string;
  valor?: number;
  valorLiq?: number;
  comissaoOta?: number;
  taxaLimpeza?: number;
  obs?: string | null;
}
