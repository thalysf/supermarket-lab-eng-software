package com.supermarket.domain.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.supermarket.domain.enums.SetorEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class ProdutoDto {

    @NotEmpty
    @Max(100)
    private String nome;

    @NotNull
    private Double precoCompra;

    @NotNull
    private Double precoVenda;

    @NotNull
    private byte[] imagem;

    @NotEmpty
    @Max(50)
    private String codigoBarras;

    @NotNull
    private Boolean fracionado;

    @NotNull
    private Long qtdEstoque;

    @NotNull
    private SetorEnum setor;

    @NotEmpty
    @Max(255)
    private String rfid;
}
