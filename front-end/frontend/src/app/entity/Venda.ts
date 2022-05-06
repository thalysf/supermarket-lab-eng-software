import { CartaoCliente } from './CartaoCliente';
import { ItemVenda } from "./ItemVenda";

export interface Venda{
    data: Date,
    cpf: string,
    nome: string,
    produtos_supermercado: ItemVenda[];
    cartoes: CartaoCliente[];
}