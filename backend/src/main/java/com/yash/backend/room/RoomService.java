package com.yash.backend.room;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomService {

	private static final String LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	private static final int CODE_LENGTH = 4;
	private static final int MAX_NAME_LENGTH = 80;
	private static final SecureRandom RANDOM = new SecureRandom();

	private final RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;

	public RoomService(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
		this.roomRepository = roomRepository;
		this.messagingTemplate = messagingTemplate;
	}

	@Transactional
	public RoomResponse create(CreateRoomRequest request) {
		Room room = new Room();
		room.setCode(generateUniqueCode());
		room.setName(normalizeName(request.name()));
		room.setPublicRoom(request.isPublic());
		room.setLanguage(normalizeLanguage(request.language()));
		room.setPlayerCount(1);
		room.setCreatedAt(Instant.now());

		Room saved = roomRepository.save(room);
		RoomResponse response = RoomResponse.from(saved);
		if (saved.isPublicRoom()) {
			messagingTemplate.convertAndSend("/topic/lobby", response);
		}
		return response;
	}

	@Transactional(readOnly = true)
	public PublicLobbyResponse listPublicLobby() {
		List<RoomResponse> rooms = roomRepository.findByPublicRoomTrueOrderByCreatedAtDesc()
				.stream()
				.map(RoomResponse::from)
				.toList();
		return new PublicLobbyResponse(rooms, roomRepository.countByPublicRoomFalse());
	}

	private String generateUniqueCode() {
		for (int attempt = 0; attempt < 32; attempt++) {
			StringBuilder code = new StringBuilder(CODE_LENGTH);
			for (int i = 0; i < CODE_LENGTH; i++) {
				code.append(LETTERS.charAt(RANDOM.nextInt(LETTERS.length())));
			}
			String candidate = code.toString();
			if (!roomRepository.existsByCode(candidate)) {
				return candidate;
			}
		}
		throw new IllegalStateException("Could not allocate a room code");
	}

	private static String normalizeName(String name) {
		String trimmed = name == null ? "" : name.trim();
		if (trimmed.isEmpty()) {
			return "New room";
		}
		return trimmed.length() > MAX_NAME_LENGTH ? trimmed.substring(0, MAX_NAME_LENGTH) : trimmed;
	}

	private static String normalizeLanguage(String language) {
		if (language == null || language.isBlank()) {
			return "English";
		}
		return language.trim();
	}
}
