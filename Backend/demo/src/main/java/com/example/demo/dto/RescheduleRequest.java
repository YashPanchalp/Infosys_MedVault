package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RescheduleRequest {

    private Long appointmentId;
    private LocalDate date;
    private LocalTime time;
    private String note;
    public Long getAppointmentId() {
        return appointmentId;
    }
    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public LocalTime getTime() {
        return time;
    }
    public void setTime(LocalTime time) {
        this.time = time;
    }
    public String getNote() {
        return note;
    }
    public void setNote(String note) {
        this.note = note;
    }

    // getters and setters
}
