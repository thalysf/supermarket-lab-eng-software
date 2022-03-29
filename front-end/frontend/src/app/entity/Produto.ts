export interface Produto {

    codigo_barras:string,
    nome:string,
    preco_venda?: number,
    preco_compra?: number,
    imagem?:any,
    fracionado?:boolean,
    categoria?:string,
    setor?:string,
    RFID?:string,
    qtd_estoque:number
}