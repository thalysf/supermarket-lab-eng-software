package com.supermarket.domain.entity;

import com.supermarket.domain.enums.SetorEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "produto")
public class Produto implements Serializable {
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "preco_compra", nullable = false)
    private Double precoCompra;

    @Column(name = "preco_venda", nullable = false)
    private Double precoVenda;

    @Lob
    @Column(name = "imagem", nullable = false)
    private String imagem;

    @Column(name = "codigo_barras", nullable = false, length = 50, unique = true)
    private String codigoBarras;

    @Column(name = "fracionado", nullable = false)
    private Boolean fracionado;

    @Column(name = "qtd_estoque", nullable = false)
    private Double qtdEstoque = 0.0;

    @Column(name = "setor", nullable = false)
    @Enumerated(EnumType.STRING)
    private SetorEnum setor;

    @Id
    @Column(name = "rfid", nullable = false)
    private String rfid;
}
