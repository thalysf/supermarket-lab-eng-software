package com.supermarket.service;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.domain.entity.Usuario;
import com.supermarket.domain.mapper.UsuarioMapper;
import com.supermarket.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    public void cadastrarUsuario(UsuarioDto usuarioDto) {
        usuarioRepository.findById(usuarioDto.getCpf()).ifPresent(u -> {throw new EntityExistsException();});
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public void atualizarUsuario(UsuarioDto usuarioDto) {
        usuarioRepository.findById(usuarioDto.getCpf()).orElseThrow(EntityNotFoundException::new);
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    public Set<UsuarioDto> listarUsuarios() {
        return usuarioMapper.setUsuarioToSetUsuarioDto(usuarioRepository.findAll());
    }
}
