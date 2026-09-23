package com.example.bloodbankmanagementsystem.security.authservice;

import com.example.bloodbankmanagementsystem.dto.auth.LoginDTO;
import com.example.bloodbankmanagementsystem.dto.auth.RegisterDTO;
import com.example.bloodbankmanagementsystem.entity.MyUser;
import com.example.bloodbankmanagementsystem.repository.MyUserRepository;
import com.example.bloodbankmanagementsystem.security.Role;
import com.example.bloodbankmanagementsystem.security.jwt.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthRegisterService {

    private final MyUserRepository myUserRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthRegisterService(MyUserRepository myUserRepository,
                               PasswordEncoder passwordEncoder,
                               AuthenticationManager authenticationManager,
                               JwtService jwtService) {
        this.myUserRepository = myUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    public void register(RegisterDTO registerDTO) {
        MyUser user = new MyUser();

        user.setUsername(registerDTO.getUsername());

        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        user.setEmail(registerDTO.getEmail());

        user.setRole(Role.USER);

        myUserRepository.save(user);
    }

    public String login(LoginDTO loginDTO) {

        UsernamePasswordAuthenticationToken loginToken =
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                );

        Authentication authentication = authenticationManager.authenticate(loginToken);

        String authority = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();  // "ROLE_USER" or "ROLE_ADMIN"

        String role;
        if (authority.startsWith("ROLE_")) {
            role = authority.substring("ROLE_".length()); // "USER" / "ADMIN"
        } else {
            role = authority;
        }

        return jwtService.generateToken(loginDTO.getUsername(), role);
    }

}
