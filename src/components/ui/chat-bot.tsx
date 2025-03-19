import { useState } from "react";
import {
  Box,
  Text,
  Image,
  Menu,
  Portal,
  IconButton,
  Input,
  Flex,
} from "@chakra-ui/react";
import rat_idle_gif from "@/assets/rat_idle.gif";
import { TfiClose } from "react-icons/tfi";
import VoiceChat from "./voice-chat";

export default function ChatBot() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <Box className={`chat_bot_container ${showChat ? "opened" : ""}`}>
      {!showChat && (
        <Menu.Root positioning={{ placement: "top-start" }}>
          <Menu.Trigger asChild>
            <Image
              src={rat_idle_gif}
              className="rat_button"
              cursor={showChat ? "default" : "pointer"}
            />
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content className="menu_dialog">
                <Text textWrap="wrap" width="200px" fontSize="0.8rem">
                  I'm RAT! Start chatting with me if you have any questions.
                </Text>
                <Menu.Item
                  value="yes_opt"
                  fontSize="0.7rem"
                  color="white"
                  onClick={() => setShowChat(true)}
                >
                  Yes
                </Menu.Item>
                <Menu.Item value="no_opt" fontSize="0.7rem" color="white">
                  No Thanks
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}
      {showChat && <VoiceChat />}
    </Box>
  );
}
