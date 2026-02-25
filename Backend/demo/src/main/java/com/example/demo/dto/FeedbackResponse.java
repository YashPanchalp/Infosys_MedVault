package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.Feedback;

public class FeedbackResponse {

    private String patientName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    public FeedbackResponse(Feedback feedback) {
        this.patientName = feedback.getPatient().getName();
        this.rating = feedback.getRating();
        this.comment = feedback.getComment();
        this.createdAt = feedback.getCreatedAt();
    }

    public String getPatientName() { return patientName; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}