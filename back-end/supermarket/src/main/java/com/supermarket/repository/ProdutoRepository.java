package com.supermarket.repository;

import com.supermarket.domain.entity.Produto;
import com.supermarket.domain.enums.SetorEnum;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

@Repository
@Transactional
public interface ProdutoRepository extends CrudRepository<Produto, String> {
    @Override
    Set<Produto> findAll();
    Optional<Produto> findByCodigoBarras(String codigoBarras);
    Optional<Set<Produto>> findBySetor(SetorEnum setor);
}
