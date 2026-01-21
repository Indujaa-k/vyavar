import React, { useState, useEffect } from "react";
import {
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { BsEnvelope } from "react-icons/bs";
import { GiPositionMarker } from "react-icons/gi";
import { HiOutlinePhone } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, resetContact } from "../../actions/contactActions";
import "./contactuscss.css";

const Contactus = () => {
  const [email, setemail] = useState("");
  const [body, setbody] = useState("");

  const dispatch = useDispatch();
  const toast = useToast();

  const contactSend = useSelector((state) => state.contactSend);
  const { loading, success, error } = contactSend;

  const handleSubmit = () => {
    if (!email || !body) {
      toast({
        title: "Missing fields",
        description: "Please enter email and message",
        status: "warning",
        duration: 3000,
        position: "top",
      });
      return;
    }

    dispatch(sendContactMessage(email, body));
  };

  useEffect(() => {
    if (success) {
      toast({
        title: "Message sent",
        description: "We will contact you shortly",
        status: "success",
        duration: 3000,
        position: "top",
      });
      setemail("");
      setbody("");
      dispatch(resetContact());
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        position: "top",
      });
      dispatch(resetContact());
    }
  }, [success, error, toast, dispatch]);

  return (
    <div className="contactUscontainer">
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <div className="headerContact">
        <Image
          className="imageContact"
          src="https://i.imgur.com/7rwaigw.jpg"
          alt="contactImage"
          objectFit="cover"
        />
        <div className="text">
          <h2>Contact</h2>
        </div>
      </div>

      <div className="card-contact">
        <div className="sendMsg">
          <h4>Send Us A Message</h4>
          <div className="inputContact">
            <InputGroup width="450px">
              <InputLeftElement
                pointerEvents="none"
                children={<BsEnvelope className="envolope" color="gray.300" />}
              />
              <Input
                value={email}
                onChange={(e) => setemail(e.target.value)}
                type="email"
                placeholder="Your Email Address"
              />
            </InputGroup>
          </div>
          <div className="textAreaCnt">
            <Textarea
              value={body}
              onChange={(e) => setbody(e.target.value)}
              width="450px"
              placeholder="How Can We Help"
              height="200px"
            />
          </div>
          <div className="contentContact">
            <Button
              onClick={handleSubmit}
              borderRadius="90px"
              colorScheme="teal"
              variant="solid"
              size="180px"
              className="contactBtn"
              isDisabled={loading} // Disable while loading
            >
              {loading ? <Spinner size="sm" color="white" /> : "Submit"}
            </Button>
          </div>
        </div>
        <div className="showAdrss">
          <div className="box">
            <div className="iconCtn">
              <GiPositionMarker opacity="0.8" />
            </div>
            <div className="adressCtn">
              <h3> Address</h3>
              <p>
                Viyavar Fashions 173A, Anna Nagar, Industrial Estate Karur,
                Tamil Nadu – 639004, India
              </p>
            </div>
          </div>
          <div className="box">
            <div className="iconCtn">
              <HiOutlinePhone opacity="0.8" />
            </div>
            <div className="adressCtn">
              <h3>Lets Talk</h3>
              <p className="infoCtn">6383532399</p>
            </div>
          </div>
          <div className="box">
            <div className="iconCtn">
              <BsEnvelope opacity="0.8" />
            </div>
            <div className="adressCtn">
              <h3>Sale Support</h3>
              <p className="infoCtn">
                <a href="mailto:viyavarfashion@gmail.com">
                  viyavarfashion@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
