package com.example.mgr.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;    
import java.util.Map;

@RestController
@RequestMapping("/subscribePay")
public class MgrPayController {

    @Value("${kakao.pay.rest.api.key}")
    private String kakaoPayRestApiKey;

    private final String KAKAO_PAY_URL = "https://kapi.kakao.com/v1/payment/ready";

    @PostMapping("/initiate")
    public Map<String, Object> initiatePayment(@RequestBody PaymentRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        // Create request body
        String requestBody = "cid=TC0ONETIME" + // 상점 식별자
                             "&partner_order_id=order_id_12345" +
                             "&partner_user_id=user_id_12345" +
                             "&item_name=" + request.getItemName() +
                             "&quantity=" + request.getQuantity() +
                             "&total_amount=" + request.getTotalAmount() +
                             "&tax_free_amount=0" +
                             "&approval_url=http://localhost:3000/approve" +
                             "&cancel_url=http://localhost:3000/cancel" +
                             "&fail_url=http://localhost:3000/fail";

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", kakaoPayRestApiKey);
        headers.set("Content-Type", "application/json");

        // Create HttpEntity
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        // Make the request
        ResponseEntity<Map> response = restTemplate.exchange(KAKAO_PAY_URL, HttpMethod.POST, entity, Map.class);

        return response.getBody();
    }

    public static class PaymentRequest {
        private String itemName;
        private int quantity;
        private int totalAmount;

        // Getters and Setters
        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public int getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(int totalAmount) {
            this.totalAmount = totalAmount;
        }
    }
}
