
package com.example.demo.dto;

public class FeedbackRequest {

    private Long appointmentId;
    private int rating;
    private String comment;

    public Long getAppointmentId() { return appointmentId; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }

    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setRating(int rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
}