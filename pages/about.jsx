import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Container,
  createStyles,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { Check, Checks, Send, X } from "tabler-icons-react";
import { APP_TITLE } from "../constants/app.constants";
import { useMediaMatch } from "../hooks/isMobile";
import profilePic from "../resources/images/about-2.png";
import * as yup from "yup";
import { useState } from "react";
import { useEffect } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firestoreClient } from "../firebase/clientConfig";
import { showNotification } from "@mantine/notifications";

export default function About() {
  const isMobile = useMediaMatch();
  const { colors } = useMantineTheme();
  const { classes } = useStyles();

  const [sending, setSending] = useState(false);
  const [sentAMessage, setSentAMessage] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Name is required."),
        email: yup
          .string()
          .email("Invalid Email")
          .required("Email Id is required."),
        message: yup
          .string()
          .required("Message is required")
          .min(20, "Message should be between 20-1024 characters in length")
          .max(1024, "Message should be between 20-1024 characters in length"),
      })
    ),
  });

  useEffect(() => {
    if (sessionStorage.getItem("sentAMessage")) setSentAMessage(true);
  }, []);

  const sendMessage = async (values) => {
    setSending(true);
    try {
      const messages = collection(firestoreClient, "messages");
      await addDoc(messages, {
        ...values,
        date: Timestamp.fromDate(new Date()),
        viewed: false,
      });
      setSentAMessage(true);
      sessionStorage.setItem("sentAMessage", true);
      showNotification({
        title: "Your message sent successfully.",
        message:
          "If required, I'll get back to you on the mail ID you provided.",
        icon: <Check size={18} />,
        color: "green",
      });
    } catch (err) {
      showNotification({
        title: "Failed to send message",
        icon: <X />,
        message: "Please try again!",
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container size="xl" pt={70}>
      <SimpleGrid
        cols={2}
        spacing="md"
        my={isMobile ? "0.25rem" : "2.25rem"}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}>
        <Box>
          <Image
            src={profilePic}
            width={512}
            height={512}
            blurDataURL={profilePic.blurDataURL}
            alt="amittras-pal-profile-image"
          />
        </Box>
        <Box p="sm">
          <Text align="end" color="dimmed" component="p" mt={0}>
            Hi! I am{" "}
            <Text component="span" weight="bold" color={colors.indigo[3]}>
              Amittras
            </Text>
            , and this is
          </Text>
          <Text
            component="h1"
            sx={{ fontSize: "3rem", lineHeight: 1 }}
            align="end"
            weight="bold"
            variant="gradient"
            mt={0}
            gradient={{
              from: colors.green[5],
              to: colors.yellow[5],
              deg: 90,
            }}>
            {APP_TITLE}
          </Text>
          <Text align="end" component="p" mt={0}>
            A blog/showcase of my adventures in the literary space.{" "}
            <Text component="span" weight={700}>
              Ideas, that are pilfered from what many call the
              &ldquo;muse&rdquo; and I call the reticent witch.{" "}
            </Text>{" "}
            I write stuff, read a lot more, and sometimes just explore little
            thoughts that run through my head at the most random hours of the
            day.
          </Text>
          <Text align="end" component="p" mt={0}>
            <Text component="span" weight={700}>
              Dark, Twisted, Relatable, and sometimes outright crazy,
            </Text>{" "}
            this blog, {APP_TITLE} is an experiment, a journal, a way for me to
            collaborate with people who are like me.{" "}
            <Text italic component="span">
              More often than not, you will find in here something that might
              make you think.
            </Text>
          </Text>
          <Text align="end" component="p" mt={0}>
            Come along with me, on a journey that has a lot of chill breaks,
            wild thoughts, and scenes that make you question the sanity of the
            writer...
          </Text>
          <Text
            align="end"
            component="p"
            mt={0}
            color={colors.indigo[3]}
            italic>
            Oh, by the way,{" "}
            <Text component="span" weight="bold">
              Cats are better than dogs,
            </Text>{" "}
            change my mind!...
          </Text>
        </Box>
        <Group
          sx={{ flexDirection: "column" }}
          px={isMobile ? 0 : "md"}
          mt="lg"
          spacing="sm"
          align="start">
          <Text size="lg" color="dimmed">
            Things to do around here!
          </Text>
          <Box
            className={classes.actionTile}
            component={NextLink}
            href="/stories">
            <Text size="lg" component="h2" className={classes.h2}>
              Explore Stories
            </Text>
            <Text component="p" color="dimmed" my={0} size="sm">
              I am no accomplished writer, but like many others, I like to cook
              up scenarios in my head and pen them down sometimes.{" "}
            </Text>
          </Box>
          <Box
            className={classes.actionTile}
            component={NextLink}
            href="/posts">
            <Text size="lg" component="h2" className={classes.h2}>
              Explore Short Posts
            </Text>
            <Text component="p" color="dimmed" my={0} size="sm">
              Little thoughts, ideas and incidents, that I keep track of, and
              try to compile into coherent scenarios.
            </Text>
          </Box>
          <Box
            className={classes.actionTile}
            component={NextLink}
            href="submissions">
            <Text size="lg" component="h2" className={classes.h2}>
              Get Featured
            </Text>
            <Text component="p" color="dimmed" my={0} size="sm">
              You can send your work to {APP_TITLE}. Let&apos;s collborate and
              build a story that originates with you, and showcases here...
            </Text>
          </Box>
        </Group>
        {sentAMessage ? (
          <Box>
            <Text size="lg" color="dimmed" mt="lg">
              Contact
            </Text>
            <Alert
              title="Thank you for your message!"
              color="indigo"
              variant="light"
              icon={<Checks />}
              mb="auto"
              mt="xs">
              <Text color="dimmed">
                Your message was sent successfully. I&apos;ll read it soon. And
                I&apos;ll get back to you on the email you provided if I need to
                talk more. 😀😀
              </Text>
            </Alert>
          </Box>
        ) : (
          <Box component="form" noValidate onSubmit={handleSubmit(sendMessage)}>
            <Text mt="lg" size="lg" weight={500} component="p">
              Have something to ask? Or have a suggestion? Is there an issue
              with the website?{" "}
              <Text component="span" color={colors.indigo[4]}>
                Write to me...
              </Text>
            </Text>
            <TextInput
              placeholder="Your Name (required)"
              {...register("name")}
              error={errors.name ? errors.name.message : ""}
            />
            <TextInput
              placeholder="Email Address (required)"
              {...register("email")}
              error={errors.email ? errors.email.message : ""}
            />
            <Textarea
              {...register("message")}
              error={errors.message ? errors.message.message : ""}
              placeholder="Question or suggestion..."
              minRows={5}
              description={
                <Group position="right" mt={4}>
                  <Text size="xs" color="dimmed">
                    {watch("message").length}/1024 characters
                  </Text>
                </Group>
              }
            />
            <Button
              size="sm"
              fullWidth={isMobile}
              rightIcon={<Send size={18} />}
              type="submit"
              loading={sending}>
              Send Message
            </Button>
          </Box>
        )}
      </SimpleGrid>
    </Container>
  );
}

const useStyles = createStyles((theme, _params, getRef) => ({
  actionTile: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dark[8],
    transition: "all 0.15s ease-in-out",
    textDecoration: "none",
    width: "100%",
    "&:hover, &:focus": {
      backgroundColor: theme.colors.dark[6],
      boxShadow: theme.shadows.sm,
      cursor: "pointer",
    },
    [`&:hover .${getRef("h2")}`]: {
      color: theme.colors.indigo[4],
    },
  },
  h2: {
    ref: getRef("h2"),
    color: theme.colors.gray[2],
    marginTop: 0,
    marginBottom: 8,
    fontWeight: "bold",
    transition: "color 0.15s ease-in-out",
  },
}));
