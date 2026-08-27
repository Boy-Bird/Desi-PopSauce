package com.yash.backend.room;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class RoomControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private RoomRepository roomRepository;

	@BeforeEach
	void clearRooms() {
		roomRepository.deleteAll();
	}

	@Test
	void createPublicRoomAppearsInLobby() throws Exception {
		mockMvc.perform(post("/api/rooms")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"name\":\"Masala Night\",\"isPublic\":true}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").isString())
				.andExpect(jsonPath("$.name").value("Masala Night"))
				.andExpect(jsonPath("$.players").value(1))
				.andExpect(jsonPath("$.language").value("English"))
				.andExpect(jsonPath("$.isPublic").value(true));

		mockMvc.perform(get("/api/rooms/public"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rooms", hasSize(1)))
				.andExpect(jsonPath("$.rooms[0].name").value("Masala Night"))
				.andExpect(jsonPath("$.privateRoomCount").value(0));
	}

	@Test
	void privateRoomIsNotListedPublicly() throws Exception {
		mockMvc.perform(post("/api/rooms")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"name\":\"Secret Kitchen\",\"isPublic\":false}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.isPublic").value(false));

		mockMvc.perform(get("/api/rooms/public"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rooms", hasSize(0)))
				.andExpect(jsonPath("$.privateRoomCount").value(1));
	}
}
