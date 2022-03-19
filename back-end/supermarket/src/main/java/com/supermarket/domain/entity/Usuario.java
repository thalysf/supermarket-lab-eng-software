package com.supermarket.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Usuario {
    @NotNull
    private String nome;

    @NotNull
    @Id
    @Size(min = 11, max = 11)
    private String cpf;

    @NotNull
    private byte[] biometria;

    @ManyToMany
    @JoinTable(name = "usuario_tela", joinColumns = {@JoinColumn(name = "cpf")}, inverseJoinColumns = {@JoinColumn(name = "idTela")})
    private Set<Tela> telas;

}
