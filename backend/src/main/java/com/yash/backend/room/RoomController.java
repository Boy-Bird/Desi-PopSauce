package com.yash.backend.room;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

	private final RoomService roomService;

	public RoomController(RoomService roomService) {
		this.roomService = roomService;
	}

	@PostMapping
	public ResponseEntity<RoomResponse> create(@RequestBody CreateRoomRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(roomService.create(request));
	}

	@GetMapping("/public")
	public PublicLobbyResponse listPublic() {
		return roomService.listPublicLobby();
	}
}
