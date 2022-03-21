package com.supermarket.domain.entity;


import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {
    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Id
    @Size(min = 11, max = 11)
    @Column(name = "cpf", nullable = false)
    private String cpf;


    @Column(name = "biometria", nullable = true)
    private byte[] biometria;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "usuario_tela", joinColumns = {@JoinColumn(name = "cpf")}, inverseJoinColumns = {@JoinColumn(name = "idTela")})
    private Set<Tela> telas;

}
