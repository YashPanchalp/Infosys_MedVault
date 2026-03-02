package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.dto.AppointmentStatus;
import com.example.demo.entity.Appointment;
import com.example.demo.entity.User;
import com.example.demo.repository.AppointmentRepository;

@Component
public class NotificationScheduler {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public NotificationScheduler(AppointmentRepository appointmentRepository,
                                 NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    // run daily at 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void sendNextDayReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Appointment> all = appointmentRepository.findAll();
        for (Appointment a : all) {
            if (a.getAppointmentDate() != null
                    && a.getAppointmentDate().equals(tomorrow)
                    && a.getStatus() == AppointmentStatus.APPROVED) {

                User patient = a.getPatient();
                User doctor = a.getDoctor();

                String pmsg = "Reminder: You have an appointment on "
                        + a.getAppointmentDate() + " at " + a.getAppointmentTime();
                notificationService.createNotification(patient, doctor, "Appointment Reminder", pmsg, a);

                String dmsg = "Reminder: You have an appointment with " + patient.getName()
                        + " on " + a.getAppointmentDate() + " at " + a.getAppointmentTime();
                notificationService.createNotification(doctor, null, "Appointment Reminder", dmsg, a);
            }
        }
    }
}
