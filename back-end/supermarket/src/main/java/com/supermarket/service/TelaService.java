package com.supermarket.service;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.domain.mapper.TelaMapper;
import com.supermarket.repository.TelaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TelaService {
    @Autowired
    private TelaRepository telaRepository;

    @Autowired
    private TelaMapper telaMapper;

    public List<TelaDto> listarTelas() {
        return telaMapper.listTelaToListTelaDto(telaRepository.findAll());
    }
}