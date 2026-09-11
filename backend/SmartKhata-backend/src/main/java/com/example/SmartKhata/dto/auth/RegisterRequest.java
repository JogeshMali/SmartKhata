package com.example.SmartKhata.dto.auth;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;

    private String shopName;
    private String shopPhone;
    private String shopAddress;
}
