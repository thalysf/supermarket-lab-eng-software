package com.supermarket.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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
    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @NotNull
    @Id
    @Column(name = "cpf", nullable = false, length = 11)
    private String cpf;

    @Lob
    @Column(name = "biometria")
    private String biometria;

    @ManyToMany
    @JoinTable(name = "usuario_tela", joinColumns = {@JoinColumn(name = "cpf")}, inverseJoinColumns = {@JoinColumn(name = "idTela")})
    private Set<Tela> telas;

}
