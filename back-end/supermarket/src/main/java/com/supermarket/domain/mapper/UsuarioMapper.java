package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.domain.entity.Usuario;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    Usuario usuarioDtoToUsuario(UsuarioDto usuarioDto);
    UsuarioDto usuarioDtoToUsuario(Usuario usuario);
    List<UsuarioDto> listUsuarioToListUsuarioDto(List<Usuario> usuarios);
}
