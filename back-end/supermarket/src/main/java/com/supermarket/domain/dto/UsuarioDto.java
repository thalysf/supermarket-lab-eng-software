package com.supermarket.domain.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

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
    @Size(max = 50)
    private String nome;

    @NotNull
    @Size(min = 11, max = 11)
    private String cpf;


    private byte[] biometria;

    private Set<TelaDto> telas;

}
