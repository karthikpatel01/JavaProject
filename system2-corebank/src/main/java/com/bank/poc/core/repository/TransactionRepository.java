package com.bank.poc.core.repository;

import com.bank.poc.core.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCardNumberOrderByTimestampDesc(String cardNumber);
}
