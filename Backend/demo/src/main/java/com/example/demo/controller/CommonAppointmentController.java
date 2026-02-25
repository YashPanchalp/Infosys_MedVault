package com.example.demo.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.AppointmentService;

    
    @RestController
@RequestMapping("/api/appointments")
public class CommonAppointmentController {

    private final AppointmentService appointmentService;

    public CommonAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam String date) {

        return ResponseEntity.ok(
                appointmentService.getAvailableSlots(
                        doctorId,
                        LocalDate.parse(date)
                )
        );
    }

   @GetMapping("/completed")
public ResponseEntity<?> getCompleted(Authentication auth) {
    return ResponseEntity.ok(
        appointmentService.getCompletedAppointments(auth.getName())
    );
}
}