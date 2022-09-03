import {
  Box,
  Button,
  createStyles,
  Divider,
  Group,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Send, X } from "tabler-icons-react";
import {
  COMMENT_HEADER,
  COMMENT_NOTICE,
  DATE_FORMATS,
} from "../../constants/app.constants";
import { useMediaMatch } from "../../hooks/isMobile";
import noComments from "../../resources/images/NoComments.svg";
import { firestoreClient } from "../../firebase/clientConfig";
import { showNotification } from "@mantine/notifications";

export default function Comments({ comments = [], title, type, target }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isMobile = useMediaMatch();
  const { classes } = useStyles();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      userName: "",
      email: "",
      title: "",
      body: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required("Name is required."),
        email: yup.string().optional().email("Invalid Email"),
        title: yup.string().required("Comment title is required"),
        body: yup.string().optional(),
      })
    ),
  });

  const submitComment = async (values) => {
    const commentDoc = {
      ...values,
      date: Timestamp.fromDate(new Date()),
      type,
      target,
      approved: false,
    };
    setSubmitting(true);
    try {
      const ref = collection(firestoreClient, "comments");
      await addDoc(ref, commentDoc);
      setShowForm(false);
      reset();
      showNotification({
        title: "Comment Submitted for review",
        message: "Your comment will be public once reviewed & moderated.",
        autoClose: 3500,
        icon: <Check />,
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Failed to submit notification",
        icon: <X />,
        message: "Please try again!",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box my="lg">
      <Text color="indigo" size="xl" my="lg" weight={500}>
        {COMMENT_HEADER} &ldquo;{title}&rdquo;
      </Text>
      {showForm && (
        <Box
          component="form"
          noValidate
          mb="sm"
          sx={{ width: "100%" }}
          onSubmit={handleSubmit(submitComment)}>
          <TextInput
            size="sm"
            required
            autoFocus
            placeholder="Your Name"
            label="Your Name"
            {...register("userName")}
            error={touchedFields.userName ? errors.userName?.message : ""}
          />
          <TextInput
            label="Email ID"
            size="sm"
            placeholder="Email"
            description="Your Email ID will not be published"
            {...register("email")}
            error={touchedFields.email ? errors.email?.message : ""}
          />
          <TextInput
            size="sm"
            required
            placeholder="Comment Title"
            label="Comment Title"
            {...register("title")}
            error={touchedFields.title ? errors.title?.message : ""}
          />
          <Textarea
            size="sm"
            placeholder="Comment Body"
            label="Comment Body"
            minRows={4}
            {...register("body")}
            error={touchedFields.body ? errors.body?.message : ""}
          />
          <Text size="sm" color="dimmed">
            {COMMENT_NOTICE}
          </Text>
          <Group mt="sm" position="right">
            <Button
              compact
              variant="subtle"
              color="red"
              leftIcon={<X size={14} />}
              onClick={() => {
                reset();
                setShowForm(!showForm);
              }}>
              Cancel
            </Button>
            <Button
              compact
              rightIcon={<Send size={14} />}
              type="submit"
              loading={submitting}>
              Add Comment
            </Button>
          </Group>
          <Divider variant="dashed" color="indigo" mt="sm" />
        </Box>
      )}
      {comments.length === 0 ? (
        <Group
          position="center"
          align="center"
          sx={{ flexDirection: "column" }}
          mt="md"
          spacing={4}>
          <Image
            src={noComments}
            width={isMobile ? 330 : 600}
            alt="no-comments-artwork"
          />
          <Text size="sm">Add the first comment on &ldquo;{title}&rdquo;.</Text>
          {!showForm && (
            <Button
              variant="subtle"
              compact
              onClick={() => setShowForm(!showForm)}>
              Leave a Comment
            </Button>
          )}
        </Group>
      ) : (
        <>
          {!showForm && (
            <Group mb="sm" position="center">
              <Button
                variant="subtle"
                compact
                onClick={() => setShowForm(!showForm)}>
                Leave a Comment
              </Button>
            </Group>
          )}
          {comments.map((comment) => (
            <Box
              p="sm"
              mb="sm"
              key={comment.id}
              className={classes.commentCard}>
              <Text weight={500}>{comment.userName}</Text>
              <Text size="sm" mb="sm">
                {dayjs(comment.date).format(DATE_FORMATS.dateTime)}
              </Text>
              <Text weight={500}>{comment.title}</Text>
              <Text color="dimmed" size="sm">
                {comment.body}
              </Text>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  commentCard: {
    backgroundColor: theme.colors.gray[9],
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
  },
}));
