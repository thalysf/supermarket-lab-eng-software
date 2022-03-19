package com.supermarket.repository;

import com.supermarket.domain.entity.Tela;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TelaRepository extends CrudRepository<Tela, Integer> {
    @Override
    List<Tela> findAll();
}
