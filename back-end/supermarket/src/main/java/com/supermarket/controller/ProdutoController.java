package com.supermarket.controller;

import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;

@RestController
@Validated
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService produtoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarProduto(@Valid @RequestBody ProdutoDto produtoDto) {
        produtoService.cadastrarProduto(produtoDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarProduto(@Valid @RequestBody ProdutoDto produtoDto) {
        produtoService.atualizarProduto(produtoDto);
    }

    @DeleteMapping("/{rfid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarProduto(@PathVariable String rfid) {
        produtoService.deletarProduto(rfid);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<ProdutoDto> listarProdutos() {
        return produtoService.listarProdutos();
    }
}
