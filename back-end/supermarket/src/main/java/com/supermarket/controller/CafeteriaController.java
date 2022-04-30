package com.supermarket.controller;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.service.CafeteriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/cafeteria")
public class CafeteriaController {
    private final CafeteriaService cafeteriaService;

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void incluirProdutosCafeteriaNoCartao(@RequestBody CartaoClienteDto cartaoClienteDto) {
        cafeteriaService.incluirProdutosCafeteriaNoCartao(cartaoClienteDto);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void limparProdutosCartao(@RequestBody CartaoClienteDto cartaoClienteDto) {
        cafeteriaService.limparProdutosCartao(cartaoClienteDto);
    }

    @GetMapping("{rfid}")
    @ResponseStatus(HttpStatus.OK)
    public CartaoClienteDto buscarCartaoCliente(@PathVariable String rfid) {
        return cafeteriaService.buscarCartaoCliente(rfid);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cafeteriaService.listarCartaoClientes();
    }
}
