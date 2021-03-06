package com.supermarket.controller;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarUsuario(@Valid @RequestBody UsuarioDto usuarioDto) {
        usuarioService.cadastrarUsuario(usuarioDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarUsuario(@Valid @RequestBody UsuarioDto usuarioDto) {
        usuarioService.atualizarUsuario(usuarioDto);
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarUsuario(@PathVariable @NotEmpty String cpf) {
        usuarioService.deletarUsuario(cpf);
    }

    @GetMapping("{cpf}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioDto buscarUsuario(@PathVariable String cpf) {
        return usuarioService.buscarUsuario(cpf);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<UsuarioDto> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

}
