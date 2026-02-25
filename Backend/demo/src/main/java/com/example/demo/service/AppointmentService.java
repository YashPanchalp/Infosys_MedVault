package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.AppointmentRequest;
import com.example.demo.dto.AppointmentResponse;
import com.example.demo.dto.AppointmentStatus;
import com.example.demo.dto.RescheduleRequest;
import com.example.demo.entity.Appointment;

import com.example.demo.entity.User;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.UserRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
    return new AppointmentResponse(appointment);
}


    public void bookAppointment(AppointmentRequest request, String patientEmail) {

        // 1️⃣ Get patient from JWT email
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2️⃣ Get doctor using doctorId
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Optional safety check
        if (!doctor.getRole().name().equals("DOCTOR")) {
            throw new RuntimeException("Selected user is not a doctor");
        }

        // 3️⃣ Check if slot already booked
        boolean exists = appointmentRepository
                .existsByDoctorAndAppointmentDateAndAppointmentTime(
                        doctor,
                        request.getDate(),
                        request.getTime()
                );

        if (exists) {
            throw new RuntimeException("Slot already booked");
        }

        // 4️⃣ Save appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getDate());
        appointment.setAppointmentTime(request.getTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        appointmentRepository.save(appointment);
    }


    public List<AppointmentResponse> getDoctorAppointments(String doctorEmail) {

    User doctor = userRepository.findByEmail(doctorEmail)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

    if (!doctor.getRole().name().equals("DOCTOR")) {
        throw new RuntimeException("Unauthorized access");
    }

    return appointmentRepository.findByDoctorId(doctor.getId())
        .stream()
        .map(this::mapToResponse)
        .toList();
}

public List<AppointmentResponse> getCompletedAppointments(String patientEmail) {

    User patient = userRepository.findByEmail(patientEmail)
            .orElseThrow();

    return appointmentRepository
            .findByPatientAndStatus(patient, AppointmentStatus.COMPLETED)
            .stream()
            .map(AppointmentResponse::new)
            .toList();
}

public List<AppointmentResponse> getTodayAppointmentsForDoctor(String email) {

    LocalDate today = LocalDate.now();

    List<Appointment> appointments =
            appointmentRepository.findByDoctorEmailAndAppointmentDateAndStatus(
                    email,
                    today,
                    AppointmentStatus.APPROVED
            );

    return appointments.stream()
            .map(AppointmentResponse::new)
            .toList();
}

public List<String> getAvailableSlots(Long doctorId, LocalDate date) {

    User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

    // Clinic fixed timings (you can later move this to DB)
    List<String> allSlots = List.of(
            "09:00", "10:30", "12:00", "15:00", "16:30"
    );

    List<Appointment> booked =
            appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);

    List<String> bookedTimes = booked.stream()
            .map(a -> a.getAppointmentTime().toString())
            .toList();

    return allSlots.stream()
            .filter(slot -> !bookedTimes.contains(slot))
            .toList();
}

public void rescheduleAppointment(RescheduleRequest request,
                                  String doctorEmail) {

    Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

    // 🔐 Security check
    if (!appointment.getDoctor().getEmail().equals(doctorEmail)) {
        throw new RuntimeException("Unauthorized action");
    }

    // 🚫 Prevent rescheduling cancelled appointment
    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
        throw new RuntimeException("Cannot reschedule cancelled appointment");
    }

    // 🔥 Prevent double booking (excluding current appointment)
    boolean exists = appointmentRepository
            .existsByDoctorAndAppointmentDateAndAppointmentTimeAndIdNot(
                    appointment.getDoctor(),
                    request.getDate(),
                    request.getTime(),
                    appointment.getId()
            );

    if (exists) {
        throw new RuntimeException("Selected slot already booked");
    }

    // ✅ Update date & time
    appointment.setAppointmentDate(request.getDate());
    appointment.setAppointmentTime(request.getTime());

    // Optional note
    if (request.getNote() != null && !request.getNote().isBlank()) {
        appointment.setReason(request.getNote());
    }

    // 🔥 Keep APPROVED
    appointment.setStatus(AppointmentStatus.APPROVED);

    appointmentRepository.save(appointment);
}

public void updateAppointmentStatus(Long appointmentId,
                                    String status,
                                    String doctorEmail) {

    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

    if (!appointment.getDoctor().getEmail().equals(doctorEmail)) {
        throw new RuntimeException("Unauthorized action");
    }

    appointment.setStatus(AppointmentStatus.valueOf(status));
    appointmentRepository.save(appointment);
}


public List<AppointmentResponse> getPatientAppointments(String patientEmail) {

    User patient = userRepository.findByEmail(patientEmail)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

    if (!patient.getRole().name().equals("PATIENT")) {
        throw new RuntimeException("Unauthorized access");
    }

    return appointmentRepository.findByPatient(patient)
            .stream()
            .map(this::mapToResponse)
            .toList();
}

}

