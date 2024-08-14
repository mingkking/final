package com.example.mgr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mgr.Service.MgrChatService;
import com.example.mgr.domain.MgrChatVO;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
//
//@RestController
//public class MgrChatController {
//
//    @Autowired
//    private MgrChatService mgrChatService;
//
//    @GetMapping("/manager/chat")
//    public String getRoomCount() {
//        long chatRoomCount = mgrChatService.getRoomsCount(); // 채팅방 수 가져오기
//        List<MgrChatVO> chatRoomList = mgrChatService.getAllRooms(); // 모든 채팅방 가져오기
//
//        // 각 채팅방의 membersCount를 계산하여 리스트로 수집
//        List<Integer> memberCount = chatRoomList.stream().map(MgrChatVO::membersCount).collect(Collectors.toList());
//
//        System.out.println("채팅방 수: " + chatRoomCount);
//        System.out.println("채팅방 상세: " + chatRoomList);
//        System.out.println("채팅방 멤버 수: " + memberCount);
//        
//        Gson gson = new GsonBuilder()
//                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
//                .create();
//        
//        String jsonString = gson.toJson(Map.of(
//        	"chatRoomCount", chatRoomCount,
//        	"chatRoomList", chatRoomList,
//        	"memberCount", memberCount        		
//        ));
//        
//
//        return jsonString;
//    } 
//}
import java.util.stream.IntStream;

@RestController
public class MgrChatController {

    @Autowired
    private MgrChatService mgrChatService;

    @GetMapping("/manager/chat")
    public String getRoomCount() {
        long chatRoomCount = mgrChatService.getRoomsCount(); // 채팅방 수 가져오기
        List<MgrChatVO> chatRoomList = mgrChatService.getAllRooms(); // 모든 채팅방 가져오기

        // 각 채팅방의 chat_num을 1부터 chatRoomCount까지 순차적으로 설정
        IntStream.range(0, chatRoomList.size())
                 .forEach(i -> chatRoomList.get(i).setChatNum(i + 1));

        // 각 채팅방의 membersCount를 계산하여 리스트로 수집
        List<Integer> memberCount = chatRoomList.stream().map(MgrChatVO::membersCount).collect(Collectors.toList());

        System.out.println("채팅방 수: " + chatRoomCount);
        System.out.println("채팅방 상세: " + chatRoomList);
        System.out.println("채팅방 멤버 수: " + memberCount);

        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();

        String jsonString = gson.toJson(Map.of(
                "chatRoomCount", chatRoomCount,
                "chatRoomList", chatRoomList,
                "memberCount", memberCount
        ));

        return jsonString;
    }
}


