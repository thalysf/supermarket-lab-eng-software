import { ItemVenda } from './ItemVenda';
export interface CartaoCliente{
    rfid: string,
    produtos_cafeteria: ItemVenda[];
    cartao_pago: boolean;
}