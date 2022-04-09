package com.supermarket.service;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.domain.mapper.TelaMapper;
import com.supermarket.repository.TelaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class TelaService {

    private final TelaRepository telaRepository;

    private final TelaMapper telaMapper;

    public Set<TelaDto> listarTelas() {
        return telaMapper.setTelaToSetTelaDto(telaRepository.findAll());
    }
}
