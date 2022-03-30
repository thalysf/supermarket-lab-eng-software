import { Byte } from "@angular/compiler/src/util";

export interface Produto {

    codigo_barras:string,
    nome:string,
    preco_venda?: number,
    preco_compra?: number,
    imagem?:any,
    fracionado?:boolean,
    categoria?:string,
    setor?:string,
    rfid?:string,
    qtd_estoque:number
}