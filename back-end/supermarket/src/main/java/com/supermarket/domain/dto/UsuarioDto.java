package com.supermarket.domain.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UsuarioDto implements Serializable {
    @NotNull
    private String nome;

    @NotNull
    @Size(min = 11, max = 11)
    private String cpf;

    @NotNull
    private byte[] biometria;

    private Set<TelaDto> telas;

}
