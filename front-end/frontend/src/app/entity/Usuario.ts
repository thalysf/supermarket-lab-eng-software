import { Tela } from './Tela';
export interface Usuario {
    nome: string,
    cpf: string,
    biometria:any,
    telas:Tela[]
}