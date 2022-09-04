import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  SimpleGrid,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, Checks, InfoCircle } from "tabler-icons-react";
import * as yup from "yup";
import { APP_TITLE } from "../../constants/app.constants";
import { firestoreClient } from "../../firebase/clientConfig";
import { useMediaMatch } from "../../hooks/isMobile";
import profilePic from "../../resources/images/about-1.png";

export default function AboutHome() {
  const { colors } = useMantineTheme();
  const isMobile = useMediaMatch();
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("subscribed")) setSubscribed(true);
  }, []);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Please enter a valid email ID.")
          .required("Please enter an Email ID."),
      })
    ),
  });

  const subscribe = async ({ email }) => {
    setSubscribing(true);
    try {
      const subscriptions = collection(firestoreClient, "subscriptions");
      const q = query(
        collection(firestoreClient, "subscriptions"),
        where("email", "==", email)
      );
      const sub = await getDocs(q);
      if (sub.docs.length > 0) {
        showNotification({
          title: "Already Subscribed",
          message: `You are already subscribed to ${APP_TITLE}`,
          color: "blue",
          icon: <InfoCircle size={18} />,
        });
      } else {
        await addDoc(subscriptions, { email });
        showNotification({
          title: "Subscribed",
          message: `You are successfully subscribed to ${APP_TITLE}`,
          color: "green",
          icon: <Check size={18} />,
        });
        reset();
        setSubscribed(true);
        sessionStorage.setItem("subscribed", true);
      }
    } catch (error) {
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Container size="xl" id="aboutBlock" p={0}>
      <SimpleGrid
        cols={2}
        spacing="md"
        my={isMobile ? "0.25rem" : "2.25rem"}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "sm", cols: 1 },
        ]}>
        <Box px="0.75rem" sx={{ order: isMobile ? 2 : 1 }}>
          <Image
            src={profilePic}
            width={512}
            height={512}
            alt="amittras-pal-profile-image"
          />
        </Box>
        <Box
          sx={{ order: isMobile ? 1 : 2 }}
          p="sm"
          component="form"
          noValidate
          onSubmit={handleSubmit(subscribe)}>
          <Text
            component="h1"
            sx={{ fontSize: "3rem", lineHeight: 1 }}
            align="end"
            weight="bold"
            variant="gradient"
            gradient={{
              from: colors.orange[5],
              to: colors.indigo[5],
              deg: 90,
            }}>
            Hi, I&rsquo;m Amittras.
          </Text>
          <Text component="p" align="end">
            {APP_TITLE} is a place where I pen down the thoughts that come to my
            mind from all around me. I turn them to stories, sometimes little
            thoughts, and sometimes just a mess of words.
          </Text>
          <Text component="p" align="end">
            Come along if you too want to sneak a peek into the dark, sometimes
            funny, mostly twisted thinking process of my mind...
          </Text>
          <Text color={colors.indigo[3]} component="p" align="end">
            Find Stories down below....
          </Text>
          {subscribed ? (
            <Alert icon={<Checks size={16} />} title="Subscribed" color="green">
              <Text color="dimmed">You are subscribed to {APP_TITLE}</Text>
            </Alert>
          ) : (
            <Grid columns={12}>
              <Grid.Col sm={12} md={9}>
                <TextInput
                  size="sm"
                  mb={0}
                  placeholder="Subscribe to the monthly newsletter."
                  {...register("email")}
                  error={errors.email?.message}
                />
              </Grid.Col>
              <Grid.Col sm={12} md={3} sx={{ flexGrow: 1 }}>
                <Button
                  size="sm"
                  fullWidth
                  variant="gradient"
                  type="submit"
                  rightIcon={<ArrowRight size={16} />}
                  loading={subscribing}
                  gradient={{
                    from: colors.orange[5],
                    to: colors.indigo[5],
                    deg: 90,
                  }}>
                  Subscribe
                </Button>
              </Grid.Col>
            </Grid>
          )}
          {!errors.email && !subscribed && (
            <Text size="xs" color="dimmed" mt={8} ml={isMobile ? 0 : "sm"}>
              You will be notified of new posts once a month via this email.
            </Text>
          )}
        </Box>
      </SimpleGrid>
    </Container>
  );
}
