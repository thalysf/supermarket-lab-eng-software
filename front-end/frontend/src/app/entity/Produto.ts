
export interface Produto {

    codigo_barras:string,
    nome:string,
    preco_venda?: number,
    preco_compra?: number,
    imagem?:any,
    fracionado?:boolean,
    setor?:string,
    rfid?:string,
    qtd_estoque:number,
    tipo:string
}