import { ItemVenda } from './ItemVenda';
export interface CartaoCliente{
    rfid: string,
    cpf: string;
    produtos_cafeteria: ItemVenda[];
    cartao_pago: boolean;
}