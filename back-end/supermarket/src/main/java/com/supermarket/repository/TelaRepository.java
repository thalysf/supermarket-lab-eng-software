package com.supermarket.repository;

import com.supermarket.domain.entity.Tela;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Set;


@Repository
@Transactional
public interface TelaRepository extends CrudRepository<Tela, Integer> {
    @Override
    Set<Tela> findAll();
}
