package com.example.bloodbankmanagementsystem.mapper;

import com.example.bloodbankmanagementsystem.dto.RecipientDTO;
import com.example.bloodbankmanagementsystem.entity.RecipientEntity;
import org.springframework.stereotype.Component;
import com.example.bloodbankmanagementsystem.dto.RecipientResponseDTO;

@Component
public class RecipientMapper {

    //Dto -> Entity

    public RecipientEntity DtoToEntity(RecipientDTO dto){

        //DTO -> Entity Mapping
        RecipientEntity entity = new RecipientEntity();
        entity.setIsDeleted(false);
        entity.setName(dto.getName());
        entity.setAge(dto.getAge());
        entity.setCity(dto.getCity());
        entity.setUnits(dto.getUnits());
        entity.setPurpose(dto.getPurpose());
        entity.setBloodGroup(dto.getBloodGroup());
        entity.setContactNumber(dto.getContactNumber());
        return entity;
    }

    public RecipientDTO EntityToDto(RecipientEntity entity){

        RecipientDTO dto = new RecipientDTO();

        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setCity(entity.getCity());
        dto.setUnits(entity.getUnits());
        dto.setPurpose(entity.getPurpose());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setContactNumber(entity.getContactNumber());
        return dto;
    }

    public RecipientResponseDTO EntityToResponseDto(RecipientEntity entity) {

        RecipientResponseDTO dto = new RecipientResponseDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setCity(entity.getCity());
        dto.setUnits(entity.getUnits());
        dto.setPurpose(entity.getPurpose());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setContactNumber(entity.getContactNumber());

        return dto;
    }
}
