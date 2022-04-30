package com.supermarket.service;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.domain.entity.CartaoCliente;
import com.supermarket.domain.entity.ItemVenda;
import com.supermarket.domain.mapper.CartaoClienteMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.CartaoClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class CartaoClienteService {
    private final CartaoClienteRepository cartaoClienteRepository;
    private final CartaoClienteMapper cartaoClienteMapper;

    public void cadastrarCartaoCliente(CartaoClienteDto cartaoClienteDto) {
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).ifPresent(u -> {
            throw new RegraNegocioException("Cartão já cadastrado!");
        });
        CartaoCliente cartaoCliente = cartaoClienteMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cartaoClienteRepository.save(cartaoCliente);
    }

    public void atualizarCartao(CartaoClienteDto cartaoClienteDto) {
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cartaoClienteMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cartaoClienteRepository.save(cartaoCliente);
    }

    public void deletarCartaoCliente(String rfid) {
        CartaoCliente cartaoCliente = cartaoClienteRepository.findById(rfid).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        if (!nullOrEmpty(cartaoCliente.getProdutosCafeteria())) {
            throw new RegraNegocioException("Cartão com produtos associados!");
        }
        cartaoClienteRepository.deleteById(rfid);
    }

    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cartaoClienteMapper.setCartaoClienteToSetCartaoClienteDto(cartaoClienteRepository.findAll());
    }

    private boolean nullOrEmpty(Set<ItemVenda> produtosCafeteria) {
        if (produtosCafeteria == null) {
            return true;
        } else return produtosCafeteria.isEmpty();
    }
}
