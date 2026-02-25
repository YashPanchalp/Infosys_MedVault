package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AppointmentRequest;
import com.example.demo.service.AppointmentService;

    @RestController
@RequestMapping("/api/patient/appointments")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    public PatientAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Book appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {

        String patientEmail = authentication.getName();

        appointmentService.bookAppointment(request, patientEmail);

        return ResponseEntity.ok("Appointment booked successfully (Pending approval)");
    }

    // Get all patient appointments
    @GetMapping
    public ResponseEntity<?> getPatientAppointments(Authentication authentication) {

        String patientEmail = authentication.getName();

        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(patientEmail)
        );
    }

}
