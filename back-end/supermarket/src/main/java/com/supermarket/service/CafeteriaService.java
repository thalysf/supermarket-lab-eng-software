package com.supermarket.service;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.domain.entity.CartaoCliente;
import com.supermarket.domain.mapper.CafeteriaMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.CafeteriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeteriaService {
    private final CafeteriaRepository cafeteriaRepository;

    private final CafeteriaMapper cafeteriaMapper;

    public void cadastrarCartaoCliente(CartaoClienteDto cartaoClienteDto) {
        cafeteriaRepository.findById(cartaoClienteDto.getRfid()).ifPresent(u -> {
            throw new RegraNegocioException("Cartão já cadastrado!");
        });
        CartaoCliente cartaoCliente = cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cafeteriaRepository.save(cartaoCliente);
    }

    public void atualizarCartaoCliente(CartaoClienteDto cartaoClienteDto) {
        cafeteriaRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cafeteriaRepository.save(cartaoCliente);
    }

    public void deletarCartaoCliente(String rfid) {
        cafeteriaRepository.deleteById(rfid);
    }

    public CartaoClienteDto buscarCartaoCliente(String rfid) {
        CartaoCliente cartaoCliente = cafeteriaRepository.findById(rfid).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));

        return cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoCliente);
    }

    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cafeteriaMapper.setCartaoClienteToSetCartaoClienteDto(cafeteriaRepository.findAll());
    }
}
