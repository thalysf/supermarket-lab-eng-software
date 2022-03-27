package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.domain.entity.Produto;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {
    Produto produtoDtoToProduto(ProdutoDto produtoDto);

    ProdutoDto produtoDtoToProduto(Produto produto);

    Set<ProdutoDto> setProdutoToSetProdutoDto(Set<Produto> produtos);
}
