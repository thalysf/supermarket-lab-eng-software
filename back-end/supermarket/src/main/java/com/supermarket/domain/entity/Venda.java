package com.supermarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "venda")
public class Venda implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_venda;

    @Column(name = "data", nullable = false)
    private Date data;

    @Column(name = "cpf", nullable = false, length = 11)
    private String cpf;

    @OneToMany(cascade = CascadeType.PERSIST)
    @JoinTable(name = "produtos_supermercado_venda", joinColumns = {@JoinColumn(name = "id_venda")}, inverseJoinColumns = {@JoinColumn(name = "id_item_venda")})
    private Set<ItemVenda> produtosSupermercado;

    @OneToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "cartoes_venda", joinColumns = {@JoinColumn(name = "id_venda")}, inverseJoinColumns = {@JoinColumn(name = "rfid")})
    private Set<CartaoCliente> cartoes;
}
