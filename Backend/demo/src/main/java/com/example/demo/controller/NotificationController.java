package com.example.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import com.example.demo.service.NotificationService;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;   
    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping("/mark-all-read")
public ResponseEntity<?> markAllAsRead(Authentication authentication) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Notification> list =
            notificationRepository.findByRecipientOrderByCreatedAtDesc(user);

    for (Notification n : list) {
        n.setReadStatus(true);
    }

    notificationRepository.saveAll(list);

    return ResponseEntity.ok("All notifications marked as read");
}
    @GetMapping("/unread-count")
public ResponseEntity<Long> getUnreadCount(Authentication authentication) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    long count = notificationRepository.countByRecipientAndReadStatusFalse(user);

    return ResponseEntity.ok(count);
}
    @GetMapping
    public ResponseEntity<List<Notification>> myNotifications(Principal principal) {
        List<Notification> list = notificationService.getNotificationsForUser(principal.getName());
        return ResponseEntity.ok(list);
    }

    

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<?> markRead(@PathVariable Long id, Principal principal) {
        notificationService.markAsRead(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}
