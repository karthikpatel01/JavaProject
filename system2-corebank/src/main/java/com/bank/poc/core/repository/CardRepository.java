package com.bank.poc.core.repository;

import com.bank.poc.core.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, String> {
}
