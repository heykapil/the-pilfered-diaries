import Subscribe from "@components/Subscribe";
import { APP_TITLE } from "@constants/app";
import { useMediaQuery } from "@hooks/media-query";
import Image from "next/image";
import React from "react";

export default function About({ image }) {
  const isLargeScreen = useMediaQuery("md");

  return (
    <div className="container-fluid py-3 shadow">
      <div className="container px-0">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center">
            <Image
              src={image}
              width={isLargeScreen ? 512 : 330}
              height={isLargeScreen ? 512 : 330}
              alt="Amittras' Profile Image"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="display-3 text-primary">Hi! I Am Amittras.</h1>
            <p>
              {APP_TITLE} is a place where I pen down the thoughts that come to
              my mind from all around me. I turn them to stories, sometimes
              little thoughts, and sometimes just a mess of words.
            </p>
            <p>
              Come along if you too want to sneak a peek into the dark,
              sometimes funny, mostly twisted thinking process of my mind...
            </p>
            <p>Find Stories down below....</p>
            {/* <SubscriptionForm /> */}
            <Subscribe />
          </div>
        </div>
      </div>
    </div>
  );
}
