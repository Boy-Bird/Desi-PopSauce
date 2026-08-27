package com.yash.backend.room;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 4)
	private String code;

	@Column(nullable = false, length = 80)
	private String name;

	@Column(name = "is_public", nullable = false)
	private boolean publicRoom;

	@Column(nullable = false, length = 32)
	private String language = "English";

	@Column(nullable = false)
	private int playerCount = 1;

	@Column(nullable = false)
	private Instant createdAt = Instant.now();
}
