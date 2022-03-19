package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.domain.entity.Tela;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TelaMapper {
    List<TelaDto> listTelaToListTelaDto(List<Tela> telas);
}
