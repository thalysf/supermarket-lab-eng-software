package com.supermarket.service;

import com.supermarket.domain.dto.ItemVendaDto;
import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.entity.Produto;
import com.supermarket.domain.mapper.ProdutoMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final ProdutoService produtoService;
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public void darBaixa( List<ItemVendaDto> itemsVendaDto){

        Set<Produto> produtosAsalvar = new HashSet<Produto>();

        for(ItemVendaDto v : itemsVendaDto){
            ProdutoDto p = produtoService.buscarProdutoCodigoBarras(v.getProduto().getCodigoBarras());
            if(p != null && p.getQtdEstoque() - v.getQuantidade() > 0){
                p.setQtdEstoque(p.getQtdEstoque() - v.getQuantidade());
                produtosAsalvar.add(produtoMapper.produtoDtoToProduto(p));
            } else{
                throw new RegraNegocioException("Produto Inexistente ou negativado");
            }
        }
        produtoRepository.saveAll(produtosAsalvar);
    }
}
