package com.supermarket.service;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.domain.entity.Usuario;
import com.supermarket.domain.mapper.UsuarioMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    public void cadastrarUsuario(UsuarioDto usuarioDto) {
        usuarioRepository.findById(usuarioDto.getCpf()).ifPresent(u -> {
             throw new RegraNegocioException("Usuário já cadastrado!");
        });
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public void atualizarUsuario(UsuarioDto usuarioDto) {
        usuarioRepository.findById(usuarioDto.getCpf()).orElseThrow(() -> new RegraNegocioException("Usuário não encontrado!"));
        Usuario usuario = usuarioMapper.usuarioDtoToUsuario(usuarioDto);
        usuarioRepository.save(usuario);
    }

    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    public UsuarioDto buscarUsuario(String cpf) {
        Usuario usuario = usuarioRepository.findByCpf(cpf);
        if(Objects.isNull(usuario)) {
            throw new RegraNegocioException("Usuário não encontrado!");
        }
        return usuarioMapper.usuarioDtoToUsuario(usuario);
    }

    public Set<UsuarioDto> listarUsuarios() {
        return usuarioMapper.setUsuarioToSetUsuarioDto(usuarioRepository.findAll());
    }
}
