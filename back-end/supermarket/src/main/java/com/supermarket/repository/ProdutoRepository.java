package com.supermarket.repository;

import com.supermarket.domain.entity.Produto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface ProdutoRepository extends CrudRepository<Produto, String> {
    @Override
    Set<Produto> findAll();
}
