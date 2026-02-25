package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.dto.FeedbackResponse;
import com.example.demo.dto.AppointmentStatus;
import com.example.demo.entity.Appointment;
import com.example.demo.entity.Feedback;
import com.example.demo.entity.User;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.UserRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           AppointmentRepository appointmentRepository,
                           UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public void submitFeedback(FeedbackRequest request, String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStatus().equals(AppointmentStatus.COMPLETED)) {
            throw new RuntimeException("Only completed appointments can be reviewed");
        }

        if (feedbackRepository.existsByAppointment(appointment)) {
            throw new RuntimeException("Review already submitted");
        }

        Feedback feedback = new Feedback();
        feedback.setAppointment(appointment);
        feedback.setDoctor(appointment.getDoctor());
        feedback.setPatient(patient);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);
    }

    public List<FeedbackResponse> getDoctorFeedbacks(String doctorEmail) {

        User doctor = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return feedbackRepository.findByDoctor(doctor)
                .stream()
                .map(FeedbackResponse::new)
                .toList();
    }
}