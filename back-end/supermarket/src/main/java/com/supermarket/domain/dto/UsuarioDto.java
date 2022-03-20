package com.supermarket.domain.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
