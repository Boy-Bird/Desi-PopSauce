package com.yash.backend.room;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RoomResponse(
		String code,
		String name,
		int players,
		String language,
		@JsonProperty("isPublic") boolean isPublic
) {

	public static RoomResponse from(Room room) {
		return new RoomResponse(
				room.getCode(),
				room.getName(),
				room.getPlayerCount(),
				room.getLanguage(),
				room.isPublicRoom()
		);
	}
}
