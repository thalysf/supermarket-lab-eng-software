import { Produto } from "./Produto";

export interface ItemVenda {
    produto: Produto,
    quantidade: number;
}