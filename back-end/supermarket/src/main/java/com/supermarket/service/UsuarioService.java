package com.supermarket.service;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.domain.entity.Usuario;
import com.supermarket.domain.mapper.UsuarioMapper;
import com.supermarket.repository.TelaRepository;
import com.supermarket.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    private final TelaRepository telaRepository;

    public void cadastrarUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public void atualizarUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioMapper.usuarioDtoToUsuario(usuarioRepository.save(usuario));
    }

    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    public Set<UsuarioDto> listarUsuarios() {
        return usuarioMapper.setUsuarioToSetUsuarioDto(usuarioRepository.findAll());
    }
}
