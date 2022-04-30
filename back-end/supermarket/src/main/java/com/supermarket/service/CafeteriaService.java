package com.supermarket.service;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.domain.entity.CartaoCliente;
import com.supermarket.domain.mapper.CafeteriaMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.CartaoClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class CafeteriaService {
    private final CartaoClienteRepository cartaoClienteRepository;

    private final CafeteriaMapper cafeteriaMapper;

    public void incluirProdutosCafeteriaNoCartao(CartaoClienteDto cartaoClienteDto) {
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cartaoClienteRepository.save(cartaoCliente);
    }

    public void limparProdutosCartao(CartaoClienteDto cartaoClienteDto) {
        cartaoClienteDto.setProdutosCafeteria(null);
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cartaoClienteRepository.save(cartaoCliente);
    }

    public CartaoClienteDto buscarCartaoCliente(String rfid) {
        CartaoCliente cartaoCliente = cartaoClienteRepository.findById(rfid).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));

        return cafeteriaMapper.cartaoClienteDtoToCartaoCliente(cartaoCliente);
    }

    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cafeteriaMapper.setCartaoClienteToSetCartaoClienteDto(cartaoClienteRepository.findAll());
    }
}
