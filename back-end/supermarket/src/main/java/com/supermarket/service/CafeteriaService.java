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
public class CafeteriaService {
    private final CartaoClienteRepository cartaoClienteRepository;

    private final CartaoClienteMapper cartaoClienteMapper;

    public void incluirProdutosCafeteriaNoCartao(CartaoClienteDto cartaoClienteDto) throws Exception {
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cartaoClienteMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);

        for(ItemVenda itemVenda : cartaoCliente.getProdutosCafeteria()){
            if(itemVenda.getProduto().getQtdEstoque() - itemVenda.getQuantidade() < 0){
                throw new RegraNegocioException(itemVenda.getProduto().getNome() + " Encontra-se indisponível no estoque");
            }
        }

        cartaoClienteRepository.save(cartaoCliente);
    }

    public void limparProdutosCartao(CartaoClienteDto cartaoClienteDto) {
        cartaoClienteDto.setProdutosCafeteria(null);
        cartaoClienteRepository.findById(cartaoClienteDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));
        CartaoCliente cartaoCliente = cartaoClienteMapper.cartaoClienteDtoToCartaoCliente(cartaoClienteDto);
        cartaoClienteRepository.save(cartaoCliente);
    }

    public CartaoClienteDto buscarCartaoCliente(String rfid) {
        CartaoCliente cartaoCliente = cartaoClienteRepository.findById(rfid).orElseThrow(() -> new RegraNegocioException("Cartão não encontrado!"));

        return cartaoClienteMapper.cartaoClienteDtoToCartaoCliente(cartaoCliente);
    }

    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cartaoClienteMapper.setCartaoClienteToSetCartaoClienteDto(cartaoClienteRepository.findAll());
    }
}
