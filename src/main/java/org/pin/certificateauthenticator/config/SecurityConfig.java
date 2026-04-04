package org.pin.certificateauthenticator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF so Postman can send POST requests without a token
                .csrf(csrf -> csrf.disable())

                // Tell Spring Security which URLs to protect and which to open
                .authorizeHttpRequests(auth -> auth
                        // Open up all your certificate endpoints to the public for testing
                        .requestMatchers("/api/certificate/**").permitAll()

                        // Keep everything else secured
                        .anyRequest().authenticated()
                );

        return http.build();
    }


}
