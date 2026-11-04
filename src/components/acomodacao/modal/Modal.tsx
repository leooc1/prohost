import useCriarAcomodacao from '../criar/useCriarAcomodacao';
import useEditarAcomodacao from '../editar/useEditarAcomodacao';
import ImageInput from '../../utils/ImageInput';
import Input from '../../utils/Input';import Select from '../../utils/Select';
;
interface ModalProps {
  atualizar?: () => Promise<void>;
  id?: number;
  title: string;
  type: 'post' | 'put';
  aberto?: boolean;
}

export default function Modal(props: ModalProps) {
  const acomodacaoNova = useCriarAcomodacao(props.atualizar);
  const acomodacaoExistente = useEditarAcomodacao(
    props.id ?? 0,
    props.atualizar,
    props.type === 'put' && Boolean(props.aberto),
  );
  const { acomodacao, changeField, changeMoney, verifyFields } =
    props.type == 'post'
      ? acomodacaoNova
      : acomodacaoExistente;

  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">{props.title}</h3>
      <form className="flex flex-col gap-2 w-full">
        <Input
          id="acomodacao-nome"
          nome="Nome"
          type="text"
          placeholder="Apartamento Guarujá"
          obrigatorio
          value={acomodacao.nome}
          onChange={(value) => changeField('nome', value)}
        />
        <div
          className={`grid ${acomodacao.tipo === 'terceiro' ? 'grid-cols-[1fr_0.5fr_1fr]' : 'grid-cols-2'} gap-2`}
        >
          <Select
            id="acomodacao-tipo"
            nome="Tipo"
            obrigatorio
            options={[
              { value: 'proprio', nome: 'Próprio' },
              { value: 'terceiro', nome: 'Terceiro' },
            ]}
            value={acomodacao.tipo}
            onChange={(value) => changeField('tipo', value)}
          />
          {acomodacao.tipo === 'terceiro' && (
            <Input
              id="acomodacao-comissao"
              nome="Comissão"
              type="number"
              placeholder="20%"
              obrigatorio
              value={acomodacao.comissao}
              onChange={(value) => changeField('comissao', value)}
            />
          )}
          <Input
            id="acomodacao-inicio-operacao"
            nome="Início de Operação"
            type="date"
            obrigatorio
            value={acomodacao.dataIniOpe}
            onChange={(value) => changeField('dataIniOpe', value)}
          />
        </div>
        {acomodacao.tipo === 'terceiro' && (
          <Select
            id="acomodacao-repasse"
            nome="Repasse"
            obrigatorio
            options={[
              {
                value: '1',
                nome: 'Porcentagem do valor bruto (Antes da dedução da comissao OTA e despesas)',
              },
              {
                value: '2',
                nome: 'Porcentagem do valor liquido (Pós dedução da comissão OTA e antes da dedução das despesas)',
              },
              {
                value: '3',
                nome: 'Porcentagem do lucro (Pós dedução da comissão OTA e despesas)',
              },
            ]}
            value={acomodacao.repasse}
            onChange={(value) => changeField('repasse', value)}
          />
        )}
        <div
          className={`grid ${acomodacao.modeloNegocio === '3' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}
        >
          <Select
            id="acomodacao-modelo"
            nome="Modelo da Comissão"
            obrigatorio
            options={[
              {
                value: '3',
                nome: 'Taxa de limpeza à parte',
              },
              {
                value: '1',
                nome: 'Taxa de limpeza inclusa',
              },
            ]}
            value={acomodacao.modeloNegocio}
            onChange={(value) => changeField('modeloNegocio', value)}
          />
          {acomodacao.modeloNegocio === '3' && (
            <Input
              id="acomodacao-taxa-limpeza"
              nome="Taxa Limpeza"
              type="text"
              placeholder="R$"
              obrigatorio
              value={acomodacao.taxaLimpeza}
              onChange={(value) => changeMoney('taxaLimpeza', value)}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            id="acomodacao-endereco"
            nome="Endereço"
            type="text"
            placeholder="Rua Fernando Beck"
            obrigatorio={false}
            value={acomodacao.endereco}
            onChange={(value) => changeField('endereco', value)}
          />
          <Input
            id="acomodacao-valor"
            nome="Valor do Imóvel"
            type="text"
            placeholder="R$"
            obrigatorio={false}
            value={acomodacao.valorImovel}
            onChange={(value) => changeMoney('valorImovel', value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            id="acomodacao-checkin"
            nome="Horário Padrão de Checkin"
            type="time"
            obrigatorio
            value={acomodacao.checkinPadrao}
            onChange={(value) => changeField('checkinPadrao', value)}
          />
          <Input
            id="acomodacao-checkout"
            nome="Horário Padrão de Checkout"
            type="time"
            obrigatorio
            value={acomodacao.checkoutPadrao}
            onChange={(value) => changeField('checkoutPadrao', value)}
          />
        </div>
        <ImageInput
          id="acomodacao-foto"
          nome="Foto de Capa"
          value={acomodacao.foto}
          onChange={(value) => changeField('foto', value)}
        />
      </form>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn btn-outline">Cancelar</button>
        </form>
        <button className="btn btn-primary" onClick={() => verifyFields()}>
          {props.type=='post'?'Cadastrar':'Editar'}
        </button>
      </div>
    </div>
  );
}
