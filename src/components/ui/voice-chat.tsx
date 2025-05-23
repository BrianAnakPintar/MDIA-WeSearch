import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Textarea,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { GiPowerButton } from "react-icons/gi";
import { IoSend } from "react-icons/io5";
import rat_idle_gif from "@/assets/rat_idle.gif";
import rat_pfp from "@/assets/rat_pfp.png";

interface MessageType {
  sender: string;
  text: string;
}

const VoiceChat: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Disconnected");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef(new Audio());

  const ephemeralKeyRef = useRef("");
  const conversationIdRef = useRef("");

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const initWebRTC = async () => {
    if (isConnected) return;

    try {
      setIsLoading(true);
      console.log("Requesting session...");
      const resp = await fetch("http://localhost:8000/session");
      const sessionData = await resp.json();

      if (!sessionData.client_secret?.value) {
        throw new Error("Invalid session data");
      }

      ephemeralKeyRef.current = sessionData.client_secret.value;
      // Preserve conversationIdRef so text and audio share context

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStreamRef.current = localStream;
      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (e) => {
        if (e.streams[0]) {
          audioRef.current.srcObject = e.streams[0];
          audioRef.current.play();
        }
      };

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = async (evt) => {
        const eventData = JSON.parse(evt.data);
        switch (eventData.type) {
          case "conversation.created":
            conversationIdRef.current = eventData.conversation.id;
            break;
          case "conversation.item.input_audio_transcription.completed":
            if (eventData.transcript?.trim()) {
              const userTranscript = eventData.transcript.trim();
              setMessages((prev) => [
                ...prev,
                { sender: "You", text: userTranscript },
              ]);
              handleUserInput(userTranscript);
            }
            break;
          case "response.audio_transcript.done":
            setMessages((prev) => [
              ...prev,
              { sender: "AI", text: eventData.transcript },
            ]);
            break;
          case "response.created":
            setStatusMessage("AI is responding...");
            break;
          case "response.audio.done":
            setStatusMessage("Connected");
            break;
          default:
            break;
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("Sending SDP offer...");
      const sdpResp = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionData.client_secret.value}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        },
      );

      const answerSdp = await sdpResp.text();
      if (!answerSdp.trim()) {
        throw new Error("Empty SDP response received.");
      }
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsConnected(true);
      setStatusMessage("Connected");
      console.log("WebRTC connection established!");
    } catch (err) {
      console.error("WebRTC error:", err);
      setStatusMessage("Error initializing WebRTC");
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = () => {
    console.log("Ending session...");
    if (pcRef.current) pcRef.current.close();
    pcRef.current = null;
    setIsConnected(false);
    setStatusMessage("Disconnected");
    setMessages([]);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (audioRef.current) audioRef.current.srcObject = null;
  };

  const handleUserInput = async (query: string) => {
    const pdfContext = await fetchPdfChunks(query);
    createResponseEvent(query, pdfContext);
  };

  const fetchPdfChunks = async (query: string): Promise<string> => {
    try {
      const r = await fetch(
        `http://localhost:8000/chunks?q=${encodeURIComponent(query)}`,
      );
      const j = await r.json();
      return j.chunks.join("\n\n");
    } catch (err) {
      console.error("Error fetching PDF:", err);
      return "";
    }
  };

  const createResponseEvent = (userQuery: string, pdfContext: string) => {
    if (!dcRef.current || dcRef.current.readyState !== "open") return;

    console.log(`Sending AI response...\n ${userQuery}`);
    const msg = {
      type: "response.create",
      response: {
        modalities: ["audio", "text"],
        instructions: `Use the following PDF context:\n${pdfContext}\nUser: ${userQuery} \nAnswer in layman terms in 2 or three sentences, speak faster`,
        voice: "ash",
        output_audio_format: "pcm16",
        temperature: 0.6,
        max_output_tokens: 400,
      },
    };

    dcRef.current.send(JSON.stringify(msg));
  };

  const sendTextMessage = async () => {
    if (!isConnected) await initWebRTC();
    const question = inputText.trim();
    if (!question) return;
    setMessages((prev) => [...prev, { sender: "You", text: question }]);
    setInputText("");
    handleUserInput(question);
  };

  return (
    <Box maxW="750px" mx="auto" p={4} className="chatbot-bg">
      <Flex align="center" justify="space-between" mb={8}>
        <Heading size="lg">RAT Chat</Heading>
        <Flex align="center" gap={4}>
          <Text>{statusMessage}</Text>
          {isConnected ? (
            <IconButton
              aria-label="End session"
              colorScheme="red"
              onClick={endSession}
            >
              <GiPowerButton />
            </IconButton>
          ) : (
            <Box display="flex">
              <IconButton
                aria-label="Start session"
                colorScheme="green"
                onClick={initWebRTC}
              >
                <GiPowerButton />
              </IconButton>
            </Box>
          )}
        </Flex>
      </Flex>

      {children}

      <Box
        bg="gray.50"
        borderRadius="md"
        p={4}
        mb={4}
        maxH="400px"
        overflowY="auto"
        background="transparent"
        display="flex"
        flexDirection="column"
        gap="1rem"
      >
        {messages.map((m, i) =>
          m.sender === "You" ? (
            <Box
              key={i}
              alignSelf="flex-end"
              bg="rgba(255,255,255,0.2)"
              p={3}
              borderRadius="md"
            >
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Avatar.Root variant="solid">
                  <Avatar.Fallback />
                  <Avatar.Image src={rat_pfp} />
                </Avatar.Root>
                <Text fontWeight="medium">{m.sender}</Text>
              </Box>
              <Text mt={1}>{m.text}</Text>
            </Box>
          ) : (
            <Box
              key={i}
              alignSelf="flex-start"
              bg="rgba(255,255,255,0.2)"
              p={3}
              borderRadius="md"
            >
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Avatar.Root>
                  <Avatar.Image src={rat_idle_gif} />
                </Avatar.Root>
                <Text fontWeight="medium">{m.sender}</Text>
              </Box>
              <Text mt={1}>{m.text}</Text>
            </Box>
          ),
        )}
      </Box>

      <Flex gap={2}>
        <Textarea
          value={inputText}
          color="white"
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) =>
            e.key === "Enter" && !e.shiftKey && sendTextMessage()
          }
          resize="vertical"
          flex={1}
        />
        <IconButton
          aria-label="Send message"
          colorScheme="blue"
          onClick={sendTextMessage}
        >
          <IoSend />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default VoiceChat;
