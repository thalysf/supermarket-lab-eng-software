package com.supermarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cartao_cliente")
public class CartaoCliente implements Serializable {
    @Id
    private String rfid;

    @Column(name = "cpf", length = 11)
    private String cpf;

    @Column(name = "nome", length = 120)
    private String nome;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "cartao_cliente_item_venda", joinColumns = {@JoinColumn(name = "id_item_venda")}, inverseJoinColumns = {@JoinColumn(name = "rfid")})
    private Set<ItemVenda> produtosCafeteria;

    private Boolean cartaoPago;
}
