package com.bank.poc.core.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumber;

    private String type;      // "withdraw" or "topup"

    private double amount;

    private LocalDateTime timestamp;

    private String status;    // SUCCESS / FAILED

    private String reason;    // reason on failure or note
}
