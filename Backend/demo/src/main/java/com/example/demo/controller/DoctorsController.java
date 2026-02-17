package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DoctorSummary;
import com.example.demo.entity.DoctorProfile;
import com.example.demo.repository.DoctorProfileRepository;

@RestController
@RequestMapping("/api")
public class DoctorsController {

    private final DoctorProfileRepository doctorProfileRepository;

    public DoctorsController(DoctorProfileRepository doctorProfileRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> listDoctors() {
        List<DoctorSummary> out = doctorProfileRepository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    private DoctorSummary map(DoctorProfile p) {
        Long id = p.getUser() != null ? p.getUser().getId() : null;
        String name = p.getUser() != null ? p.getUser().getName() : null;
        String spec = p.getSpecialization();
        String hosp = p.getHospital() != null ? p.getHospital().getName() : null;
        return new DoctorSummary(id, name, spec, hosp);
    }
}
