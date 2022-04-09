import { ItemVenda } from './ItemVenda';
export interface CartaoCliente{
    rfid: string,
    produtosCafeteria: ItemVenda[];
    cartaoPago: boolean;
}