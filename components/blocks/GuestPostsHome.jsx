import Image from "next/image";
import Link from "next/link";
import React from "react";
import { APP_TITLE } from "../../constants/app.constants";
import { useMediaQuery } from "../../hooks/media-query";
import noPostsArt from "../../resources/images/NoGuestPosts.svg";
import submitWork from "../../resources/images/submissions-artwork.svg";
import PostSmall from "../contentCards/PostSmall";

export default function GuestPostsHome({ posts }) {
  const isLargeScreen = useMediaQuery("md");
  return (
    <div className="container-fluid pt-2 pb-4 bg-primary text-dark">
      <div className="container px-0">
        <h3 className="display-5">Thoughts from the guests</h3>
        <div
          className={`row flex-md-row-reverse ${
            posts.length === 0 ? "align-items-center" : ""
          }`}>
          <div
            className={`col-md-6 mb-5 mb-md-0 pt-4 pt-md-0 ${
              posts.length === 0 ? "d-flex flex-column align-items-center" : ""
            }`}>
            {posts.length > 0 ? (
              posts.map((post) => <PostSmall post={post} key={post.slug} />)
            ) : (
              <>
                <Image
                  src={noPostsArt}
                  width={isLargeScreen ? 512 : 330}
                  blurDataURL={noPostsArt.blurDataURL}
                  alt="no-guest-posts"
                  className="mb-3"
                />
                <p className="text-center fs-5">
                  No Guest Posts yet! Be the first to post on {APP_TITLE} as a
                  guest.
                </p>
                <Link className="btn btn-dark" href="/submissions">
                  Submit your work
                </Link>
              </>
            )}
          </div>
          <div className="col-md-6 d-flex flex-column align-items-center">
            <Image
              src={submitWork}
              width={isLargeScreen ? 512 : 330}
              blurDataURL={submitWork.blurDataURL}
              alt="submit-work-artwork"
              className="mb-3"
            />
            <p className="text-center fs-5">
              {APP_TITLE} is a collaborative platform and you are welcome to
              send in your work for showcasing here. <br />{" "}
              <span className="fw-bold">No Strings Attached! Promise</span>
            </p>
            <Link className="btn btn-dark" href="/submissions">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
