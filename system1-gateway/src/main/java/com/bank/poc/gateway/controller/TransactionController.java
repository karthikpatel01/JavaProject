package com.bank.poc.gateway.controller;

import com.bank.poc.gateway.dto.ProcessResponse;
import com.bank.poc.gateway.dto.TransactionRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final RestTemplate restTemplate;
    private static final String CORE_URL = "http://localhost:8082/api/process";

    public TransactionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/transaction")
    public ResponseEntity<ProcessResponse> handleTransaction(@Valid @RequestBody TransactionRequest req) {

        // Basic validation
        if (req.getCardNumber() == null || !req.getCardNumber().startsWith("4")) {
            ProcessResponse resp = new ProcessResponse();
            resp.setSuccess(false);
            resp.setMessage("Card range not supported (must start with '4')");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        if (req.getAmount() <= 0) {
            ProcessResponse resp = new ProcessResponse();
            resp.setSuccess(false);
            resp.setMessage("Amount must be > 0");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String type = req.getType() != null ? req.getType().toLowerCase() : "";
        if (!type.equals("withdraw") && !type.equals("topup")) {
            ProcessResponse resp = new ProcessResponse();
            resp.setSuccess(false);
            resp.setMessage("Type must be 'withdraw' or 'topup'");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        // Forward to System 2
        try {
            ProcessResponse coreResp = restTemplate
                    .postForObject(CORE_URL, req, ProcessResponse.class);

            if (coreResp == null) {
                ProcessResponse resp = new ProcessResponse();
                resp.setSuccess(false);
                resp.setMessage("No response from core system");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
            }

            return ResponseEntity.ok(coreResp);

        } catch (Exception e) {
            ProcessResponse resp = new ProcessResponse();
            resp.setSuccess(false);
            resp.setMessage("Error calling core system: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }
}
