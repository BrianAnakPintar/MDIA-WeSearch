import { Text, Button, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/ui/navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="landing-page">
        <div className="left-landing">
          <Text textStyle="5xl" fontWeight="bold" textAlign="center">
            Research Simplified <br />
            Just For You
          </Text>
          <Text>
            AI-powered tools simplifying research analysis and comprehension
          </Text>
          <Link to="/home">
            <Button borderRadius="1rem">Explore Research</Button>
          </Link>
        </div>
        <div className="right-landing">
          <Image></Image>
        </div>
      </div>
    </>
  );
}

export default App;
