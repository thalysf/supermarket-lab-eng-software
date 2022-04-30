package com.supermarket.service;

import com.supermarket.domain.dto.ItemVendaDto;
import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.dto.VendaDto;
import com.supermarket.domain.entity.Produto;
import com.supermarket.domain.mapper.CafeteriaMapper;
import com.supermarket.domain.mapper.ProdutoMapper;
import com.supermarket.domain.mapper.VendaMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.CartaoClienteRepository;
import com.supermarket.repository.ProdutoRepository;
import com.supermarket.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class VendaService {

    private final ProdutoRepository produtoRepository;
    private final CartaoClienteRepository cartaoClienteRepository;
    private final VendaRepository vendaRepository;

    private final ProdutoMapper produtoMapper;
    private final CafeteriaMapper cafeteriaMapper;
    private final VendaMapper vendaMapper;

    private Set<Produto> produtosAsalvar = new HashSet<Produto>();

    public void realizarVenda(VendaDto vendaDto){
        darBaixaEstoque(vendaDto.getProdutosSupermercado());
        vendaDto.getCartoes().forEach(c -> {
            darBaixaEstoque(c.getProdutosCafeteria());
            c.setCartaoPago(true);
        });

        cartaoClienteRepository.saveAll(cafeteriaMapper.setCartaoClienteDtoToSetCartaoCliente(vendaDto.getCartoes()));
        produtoRepository.saveAll(produtosAsalvar);
        vendaRepository.save(vendaMapper.vendaDtoToVenda(vendaDto));
    }

    private void darBaixaEstoque(Set<ItemVendaDto> itensVenda){
        for(ItemVendaDto v : itensVenda){
            ProdutoDto p = produtoMapper.produtoDtoToProduto(
                                    produtoRepository
                                            .findByCodigoBarras
                                                    (v.getProduto().getCodigoBarras())
                                            .orElseThrow(() -> new RegraNegocioException("Produto não encontrado!")));
            if(p != null && p.getQtdEstoque() - v.getQuantidade() >= 0){
                p.setQtdEstoque(p.getQtdEstoque() - v.getQuantidade());
                produtosAsalvar.add(produtoMapper.produtoDtoToProduto(p));
            } else{
                throw new RegraNegocioException("Produto Inexistente ou negativado");
            }
        }
    }
}
