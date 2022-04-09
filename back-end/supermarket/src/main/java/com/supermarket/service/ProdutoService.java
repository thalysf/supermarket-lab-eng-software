package com.supermarket.service;

import com.supermarket.domain.dto.EstoqueDTO;
import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.entity.Produto;
import com.supermarket.domain.enums.SetorEnum;
import com.supermarket.domain.mapper.ProdutoMapper;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;

    public void cadastrarProduto(ProdutoDto produtoDto) {
        produtoRepository.findById(produtoDto.getRfid()).ifPresent(u -> {
            throw new RegraNegocioException("Produto já cadastrado!");
        });

        Produto produto = produtoMapper.produtoDtoToProduto(produtoDto);
        produto.setQtdEstoque(0.0);

        produtoRepository.save(produto);
    }

    public void atualizarProduto(ProdutoDto produtoDto) {
        produtoRepository.findById(produtoDto.getRfid()).orElseThrow(() -> new RegraNegocioException("Produto não encontrado!"));

        Produto produto = produtoMapper.produtoDtoToProduto(produtoDto);
        produto.setQtdEstoque(0.0);

        produtoRepository.save(produto);
    }

    public void atualizarEstoque(EstoqueDTO estoqueDTO) {
        Produto produto = produtoRepository.findByCodigoBarras(estoqueDTO.getCodigoBarras()).orElseThrow(() -> new RegraNegocioException("Código de barras do produto não encontrado!"));
        produto.setQtdEstoque(estoqueDTO.getQtdEstoque());
        produtoRepository.save(produto);
    }

    public ProdutoDto buscarProdutoCodigoBarras(String codigoBarras) {
        Produto produto = produtoRepository.findByCodigoBarras(codigoBarras).orElseThrow(() -> new RegraNegocioException("Código de barras do produto não encontrado!"));
        return produtoMapper.produtoDtoToProduto(produto);
    }

    public void deletarProduto(String rfid) {
        produtoRepository.deleteById(rfid);
    }

    public Set<ProdutoDto> listarProdutos() {
        return produtoMapper.setProdutoToSetProdutoDto(produtoRepository.findAll());
    }

    public Set<ProdutoDto> listarProdutosPorSetor(SetorEnum setor) {
        return produtoMapper.setProdutoToSetProdutoDto(produtoRepository.findBySetor(setor).orElseThrow(() -> new RegraNegocioException("Setor sem produtos cadastrados!")));
    }
}
