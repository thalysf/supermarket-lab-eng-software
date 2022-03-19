package com.supermarket.service;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.domain.mapper.UsuarioMapper;
import com.supermarket.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    public void cadastrarUsuario(UsuarioDto usuarioDto) {
        var usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public UsuarioDto atualizarUsuario(UsuarioDto usuarioDto) {
        var usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        return usuarioMapper.usuarioDtoToUsuario(usuarioRepository.save(usuario));
    }

    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    public Set<UsuarioDto> listarUsuarios() {
        return usuarioMapper.setUsuarioToSetUsuarioDto(usuarioRepository.findAll());
    }
}
