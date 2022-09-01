import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  Box,
  Button,
  Container,
  Grid,
  Group,
  List,
  Modal,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  At,
  Check,
  Checks,
  Send,
  User,
  X,
} from "tabler-icons-react";
import * as yup from "yup";
import { APP_TITLE } from "../constants/app.constants";
import { firestoreClient } from "../firebase/clientConfig";
import { useMediaMatch } from "../hooks/isMobile";
import artwork from "../resources/images/submissions-artwork.svg";
import { showNotification } from "@mantine/notifications";

export default function Submissions() {
  const isMobile = useMediaMatch();
  const { shadows, colors } = useMantineTheme();

  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      userName: "",
      emailId: "",
      ideaTitle: "",
      ideaDescription: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required("Name is required."),
        emailId: yup
          .string()
          .email("Invalid Email")
          .required("Email Id is required."),
        ideaTitle: yup
          .string()
          .required("Title is required")
          .min(20, "Title should be between 20-180 characters in length")
          .max(180, "Title should be between 20-180 characters in length"),
        ideaDescription: yup
          .string()
          .required("Brief description is required.")
          .min(120, "Title should be between 120-1000 characters in length")
          .max(1000, "Title should be between 120-1000 characters in length"),
      })
    ),
  });

  const [submitting, setSubmitting] = useState(false);
  const submitIdea = async (values) => {
    setSubmitting(true);
    try {
      const collectionRef = collection(firestoreClient, "submissions");
      await addDoc(collectionRef, values);
      showNotification({
        title: "Submission successful",
        message:
          "Your submission was successful, we'll get back to you within 24 hours.",
        icon: <Check size={18} />,
        color: "green",
      });
      setOpen(false);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Container fluid pt="70px" pb="2rem" px={0} sx={{ minHeight: "100vh" }}>
        <Container size="md">
          <Grid
            cols={2}
            align="center"
            sx={{ flexDirection: isMobile ? "column-reverse" : "row" }}>
            <Grid.Col sm={12} md={6}>
              <Text
                weight="bold"
                color="indigo"
                sx={{
                  fontSize: "2.5rem",
                  lineHeight: 1,
                  textAlign: isMobile ? "center" : "left",
                }}>
                Have a Great Idea?
              </Text>
              <Text
                size="lg"
                color="gray"
                mt="sm"
                align={isMobile ? "center" : "left"}>
                That you think suits {APP_TITLE} style.
              </Text>
              <Button
                mt="lg"
                size={isMobile ? "lg" : "xl"}
                fullWidth={isMobile}
                rightIcon={<ArrowRight />}
                onClick={() => setOpen(!open)}>
                Share it with us
              </Button>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Image src={artwork} alt="artwork" />
            </Grid.Col>
          </Grid>
          <Text mt="lg" mb="sm" weight={500} color="dimmed">
            Submissions FAQs
          </Text>
          <Accordion variant="separated">
            <Accordion.Item value="steps" sx={{ boxShadow: shadows.sm }}>
              <Accordion.Control>
                <Text size="lg" weight="bold" color="dimmed">
                  How do I submit content to {APP_TITLE}?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <List spacing="sm">
                  <List.Item
                    icon={
                      <ThemeIcon color="green" variant="light" radius="xl">
                        <Checks size={16} />
                      </ThemeIcon>
                    }>
                    Simply click the Share it with us button above
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="green" variant="light" radius="xl">
                        <Checks size={16} />
                      </ThemeIcon>
                    }>
                    Fill out little information about you and your idea. Make
                    sure to provide a valid email address.
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="green" variant="light" radius="xl">
                        <Checks size={16} />
                      </ThemeIcon>
                    }>
                    We will reach out to you on the mail, requesting the
                    complete content and few other details relating to your
                    composition.
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="green" variant="light" radius="xl">
                        <Checks size={16} />
                      </ThemeIcon>
                    }>
                    And that&rsquo;s it. Your post is ready to be published on{" "}
                    {APP_TITLE}
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="basics" sx={{ boxShadow: shadows.sm }}>
              <Accordion.Control>
                <Text size="lg" weight="bold" color="dimmed">
                  What kind of submissions does {APP_TITLE} accept?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text component="p">
                  <Text component="span">
                    We accept all sorts of thoughts relating to life for single
                    posts,{" "}
                  </Text>
                  <Text component="span" weight="bold">
                    Thoughtful Ideas, Short Stories, Poems, Non-fiction,{" "}
                  </Text>
                  <Text component="span">
                    or if you have something else in mind and you would like to
                    talk more,{" "}
                  </Text>
                  <Text
                    component={NextLink}
                    href="/contact"
                    color="indigo"
                    variant="link">
                    let&rsquo;s talk...
                  </Text>
                </Text>
                <Text component="p">
                  <Text component="span">
                    {APP_TITLE} publishes content of a specific type, and we go
                    through all submissions carefully before posting. Hence we
                    encourage contributors to go through our current content and
                    get a taste of the type of content we post before submitting
                    your work.
                  </Text>
                </Text>
                <Text component="p">
                  <Text component="span" weight="bold" color="red">
                    NOTE:{" "}
                  </Text>
                  <Text component="span" color="red">
                    We highly encourage original submissions, and expect our
                    contributors to submit content that they own completely.
                  </Text>
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="lang" sx={{ boxShadow: shadows.sm }}>
              <Accordion.Control>
                <Text size="lg" weight="bold" color="dimmed">
                  Do you accept submissions in any language or format?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text component="span">
                  {APP_TITLE} is intended to be primarily in English, but we
                  will definitely not skip something just because it is in a
                  diffent language.{" "}
                </Text>
                <Text component="span" weight="bold">
                  Send in your content, irrespective of the language, and we
                  will look it over definitely.{" "}
                </Text>
                <Text component="span">
                  As for formats, any supported text format is fine if it can be
                  read on a digital media. {APP_TITLE} admin will try to respect
                  the source formatting as closely as possible.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="rewards" sx={{ boxShadow: shadows.sm }}>
              <Accordion.Control>
                <Text size="lg" weight="bold" color="dimmed">
                  What is in it for me if I post something to {APP_TITLE}?
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text weight={500}>
                  {APP_TITLE} is a privately owned non-profit blog.
                </Text>
                <Text component="p">
                  <Text component="span">As such, </Text>
                  <Text component="span" weight="bold">
                    as of today, we do not promise any rewards or compensations
                    for submitting to our platform.{" "}
                  </Text>
                  <Text component="span">
                    However, if {APP_TITLE} becomes profitable sometime in the
                    future, we will not forget our contributors.
                  </Text>
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Container>
      <Modal
        centered
        withCloseButton
        overflow="outside"
        size="lg"
        sx={{ border: `1px solid ${colors.gray[4]}` }}
        opened={open}
        title="Submit your content"
        onClose={() => setOpen(!open)}
        closeOnClickOutside={false}>
        <Box component="form" noValidate onSubmit={handleSubmit(submitIdea)}>
          <TextInput
            label="Full Name"
            required
            data-autofocus
            placeholder="Name is required"
            icon={<User size={18} />}
            {...register("userName")}
            error={touchedFields.userName ? errors.userName?.message : ""}
          />
          <TextInput
            label="Email Address"
            required
            placeholder="Email is required"
            icon={<At size={18} />}
            description="We will reach out to you on the provided e-mail for next steps.
            Please make sure you are able to receive mails on this address."
            {...register("emailId")}
            error={touchedFields.emailId ? errors.emailId?.message : ""}
          />
          <TextInput
            label="Title of your idea"
            required
            placeholder="A short title is always better"
            {...register("ideaTitle")}
            error={touchedFields.ideaTitle ? errors.ideaTitle?.message : ""}
          />
          <Textarea
            minRows={6}
            maxRows={6}
            label="Brief Description"
            placeholder="Describe your idea or story in about 120-1000 characters"
            required
            {...register("ideaDescription")}
            description={
              <Group position="right" mt={4}>
                <Text size="xs" color="dimmed">
                  {watch("ideaDescription").length}/1000 characters
                </Text>
              </Group>
            }
            error={
              touchedFields.ideaDescription
                ? errors.ideaDescription?.message
                : ""
            }
          />
          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              color="red"
              leftIcon={<X size={16} />}
              type="reset"
              onClick={() => {
                reset();
                setOpen(!open);
              }}>
              Cancel
            </Button>
            <Button
              size="sm"
              rightIcon={<Send size={16} />}
              type="submit"
              loading={submitting}>
              Submit
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
