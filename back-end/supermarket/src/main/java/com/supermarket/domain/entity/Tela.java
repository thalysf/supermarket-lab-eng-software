package com.supermarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Tela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTela;

    @NotNull
    private String nome;
}
