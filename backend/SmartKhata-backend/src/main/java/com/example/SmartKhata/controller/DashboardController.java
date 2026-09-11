package com.example.SmartKhata.controller;

import com.example.SmartKhata.dto.dashboard.DashboardResponse;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.service.CurrentUserService;
import com.example.SmartKhata.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public DashboardResponse getDashboard(
            Authentication authentication) {

        Shop shop = currentUserService.getCurrentShop(authentication);

        return dashboardService.getDashboard(shop);
    }

}