package com.supermarket.controller;

import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.enums.SetorEnum;
import com.supermarket.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService produtoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarProduto(@RequestBody ProdutoDto produtoDto) {
        produtoService.cadastrarProduto(produtoDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarProduto(@RequestBody ProdutoDto produtoDto) {
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

    @GetMapping("/setor/{setor}")
    @ResponseStatus(HttpStatus.OK)
    public Set<ProdutoDto> listarProdutosPorSetor(@PathVariable SetorEnum setor) {
        return produtoService.listarProdutosPorSetor(setor);
    }

    @GetMapping("/codigo-barras/{codigoBarras}")
    @ResponseStatus(HttpStatus.OK)
    public ProdutoDto buscarProdutoPorSetor(@PathVariable String codigoBarras) {
        return produtoService.buscarProdutoCodigoBarras(codigoBarras);
    }
}
