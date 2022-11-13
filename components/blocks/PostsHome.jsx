import { IconExternalLink } from "@tabler/icons";
import Link from "next/link";
import React from "react";
import PostSmall from "../contentCards/PostSmall";

export default function PostsHome({ posts }) {
  return (
    <>
      <div className="d-flex w-100 mb-4 align-items-center">
        <h2 className="mb-0 text-muted">Posts</h2>
        <Link
          href="/posts"
          data-bs-toggle="tooltip"
          data-bs-offset="0,5"
          data-bs-placement="left"
          title="View All Posts"
          className="icon-btn ms-auto">
          <IconExternalLink size={18} />
        </Link>
      </div>
      {posts.map((post) => (
        <PostSmall key={post.slug} post={post} />
      ))}
    </>
  );
}
