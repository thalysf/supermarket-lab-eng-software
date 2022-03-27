package com.supermarket.domain.entity;

import com.supermarket.domain.enums.SetorEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "produto")
public class Produto {
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "preco_compra", nullable = false)
    private Double precoCompra;

    @Column(name = "preco_venda", nullable = false)
    private Double precoVenda;

    @Column(name = "imagem", nullable = false)
    private byte[] imagem;

    @Column(name = "codigo_barras", nullable = false, length = 50, unique = true)
    private String codigoBarras;

    @Column(name = "fracionado", nullable = false)
    private Boolean fracionado;

    @Column(name = "qtd_estoque", nullable = false)
    private Long qtdEstoque = 0L;

    @Column(name = "setor", nullable = false)
    @Enumerated(EnumType.STRING)
    private SetorEnum setor;

    @Id
    @Column(name = "rfid", nullable = false)
    private String rfid;
}
