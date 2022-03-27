package com.supermarket.service;

import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.entity.Produto;
import com.supermarket.domain.mapper.ProdutoMapper;
import com.supermarket.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public void cadastrarProduto(ProdutoDto produtoDto) {
        produtoRepository.findById(produtoDto.getRfid()).ifPresent(u -> {
            throw new EntityExistsException();
        });

        Produto produto = produtoMapper.produtoDtoToProduto(produtoDto);
        produto.setQtdEstoque(0L);

        produtoRepository.save(produto);
    }

    public void atualizarProduto(ProdutoDto produtoDto) {
        produtoRepository.findById(produtoDto.getRfid()).orElseThrow(EntityNotFoundException::new);

        Produto produto = produtoMapper.produtoDtoToProduto(produtoDto);
        produto.setQtdEstoque(0L);

        produtoRepository.save(produto);
    }

    public void deletarProduto(String rfid) {
        produtoRepository.deleteById(rfid);
    }

    public Set<ProdutoDto> listarProdutos() {
        return produtoMapper.setProdutoToSetProdutoDto(produtoRepository.findAll());
    }
}
