package com.supermarket.controller;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.service.CafeteriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/cafeteria")
public class CafeteriaController {
    private final CafeteriaService cafeteriaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarCartaoCliente(@Valid @RequestBody CartaoClienteDto cartaoClienteDto) {
        cafeteriaService.cadastrarCartaoCliente(cartaoClienteDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarCartaoCliente(@Valid @RequestBody CartaoClienteDto cartaoClienteDto) {
        cafeteriaService.atualizarCartaoCliente(cartaoClienteDto);
    }

    @DeleteMapping("/{rfid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarCartaoCliente(@PathVariable @NotEmpty String rfid) {
        cafeteriaService.deletarCartaoCliente(rfid);
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
