package com.supermarket.repository;

import com.supermarket.domain.entity.Tela;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;


@Repository
public interface TelaRepository extends CrudRepository<Tela, Integer> {
    @Override
    Set<Tela> findAll();
}
